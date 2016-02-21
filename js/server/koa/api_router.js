"use strict";
let krouter_api = require("koa-router")();
let db = require("../db.js");
let sha512 = require("sha512");
let utils =  require("../utils.js") ;
// ALL ROUTES HERE
module.exports = function(){
    krouter_api.get('/timeline/:timelineid', function* (next){
        let query = this.request.query ;
        let params = this.params ;
        let timelineid = params.timelineid;
        this.body = {"json":{}}
    })

    krouter_api.post('/user/', function* (next){
        // create new user
        let username = this.request.body.username ;
        let email = this.request.body.email ;
        let password = this.request.body.password
        if (!!username && !!email && !!password){
            let salt = sha512(Math.random().toString(16)).toString('hex').substr(0,32);
             // should be an already sha512'd pass
            let salted_password = utils.saltedPassword(password,salt);
            let user = yield db.User.findOne({where :{"$or":{'username':username,'email':email}}});
            if (!user){
                user = yield db.User.create({
                    username:username,
                    email:email,
                    password:salted_password,
                    salt:salt,
                })
                // TODO send email to confirm account creation
                this.body = {
                    "message":"Account successfully created",
                    "userid":user.id,
                    "credentials_key":yield* utils.generateCredentials(user.id,salted_password,user.salt)
                };
            }else{
                this.status = 409 ;
                this.message = "username "+username+" or email "+email+" already in use";
            }
        }else{
            this.status = 400 ;
            this.message = "'username', 'email' and 'password' are needed for this request"
        }
    })

    krouter_api.get('/user/timelines/', function* (next){
        // create new user
        let id = this.request.query.id ;
        let credentials_key = this.request.query.credentials_key ;
        try {
            let is_connected = yield* utils.checkCredentials(id,credentials_key);
            if (is_connected){
                this.body = {"timelines":yield db.Timeline.findAll({where:{'owner':id}})};
            } else {
                this.status = 401 ;
                this.message = "Bad credentials to access this data" ;
            }
        } catch(e) {
            if (e.name === "UserNotFoundError"){
                this.status = 404 ;
                this.message = "User was not found in the database" ;
            } else {
                throw e ;
            }
        }
    })

    krouter_api.post('/user/connect/',function *(next){
        let username = this.request.body.username ;
        let email = this.request.body.email ;
        let userid = this.request.body.userid ;
        let password = this.request.body.password ;
        let user = yield db.User.findOne({where :{"$or":{'id':userid,'username':username,'email':email}}});
        if (user == null){
            this.status = 404 ;
            this.message = "User was not found in the database, or invalid password" ;
        }else{
            let salted_password = utils.saltedPassword(password,user.salt);
            if (salted_password === user.password) {// good password my friend
                this.body = {"userid":user.id,"credentials_key":yield* utils.generateCredentials(user.id,user.password,user.salt)};
            } else {
                this.status = 404 ;
                this.message = "User was not found in the database, or invalid password" ;
            }
        }
    })
    return krouter_api ;
}
