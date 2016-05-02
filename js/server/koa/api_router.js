"use strict";
let krouter_api = require("koa-router")();
let db = require("../db.js");
let sha512 = require("sha512");
let utils =  require("../utils.js") ;
let winston = require("winston");
// ALL ROUTES HERE
module.exports = function(){
    krouter_api.post('/user/', function* (next){
        winston.debug("Received POST /user/ request : "+JSON.stringify(this.request.body));
        // create new user
        let username = this.request.body.username ;
        let email = this.request.body.email ;
        let password = this.request.body.password
        if (!!username && !!email && !!password){
            if (username.length < 128 && email.length < 128){
                // if all variables are defined
                let salt = sha512(Math.random().toString(16)).toString('hex').substr(0,32);
                // should be an already sha512'd password
                // we wouldnt want to sent plain text password to a server ...
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
                    winston.verbose("Error when creating account : username "+username+" or email "+email+" already in use");
                }
            } else {
                this.status = 400 ;
                this.message = "'username' or 'email' are too long, must be under 128 characters"
                winston.verbose("'username' or 'email' are too long, must be under 128 characters ; request :"+JSON.stringify(this.request.body));
            }
        }else{
            this.status = 400 ;
            this.message = "'username', 'email' and 'password' are needed for this request"
            winston.verbose("Bad 'create user' request : "+JSON.stringify(this.request.body));
        }
    })

    krouter_api.post('/user/resetPassword', function* (next){
        winston.debug("Received POST /user/resetPassword request : "+JSON.stringify(this.request.body));
        // resets password of said user
        let username = this.request.body.username ;
        let email = this.request.body.email ;
        if (!!username || !!email){
            let user = yield db.User.findOne({where :{"$or":{'username':username,'email':email}}});
            if (user != null){
                let user_id = user.id ;
                let randomPassword = "123456" ; // TODO: replace this by a real password ...
                //yield db.Timeline.update({timeline:JSON.stringify(timeline),last_modified:Date.now()},{where:{'owner':user_id,'id':timelineid}}) ;
                this.status = 400 ;
                this.message = "not implemented";
                // TODO : implement
            } else {
                this.status = 404 ;
                this.message = "username or email not found";
                winston.verbose("'username' or 'email' were not found for password reset [username:"+(username||"(nothing)")+",email:"+(email||"(nothing)")+"]");
            }
        }else{
            this.status = 400 ;
            this.message = "'username' or 'email' is needed for this request";
            winston.verbose("Bad 'reset password' request : "+JSON.stringify(this.request.body));
        }
    })

    krouter_api.get('/user/timelines/', function* (next){
        winston.debug("Received /user/timelines/ request : "+JSON.stringify(this.request.query));
        let user_id = this.request.query.id || this.request.query.user_id || this.request.query.userid ;
        let credentials_key = this.request.query.credentials_key ;
        try {
            let is_connected = yield* utils.checkCredentials(user_id,credentials_key);
            if (is_connected){
                // success, return the answer
                let timelines = yield db.Timeline.findAll({where:{'owner':user_id}}) ;
                timelines = timelines.map((v) => {v.timeline = JSON.parse(v.timeline);return v ;});
                this.body = {"timelines":timelines};
            } else {
                this.status = 401 ;
                this.message = "Bad credentials to access this data" ;
                winston.verbose("Bad credentials at /user/timelines , request : "+JSON.stringify(this.request.query));
            }
        } catch(e) {
            if (e.name === "UserNotFoundError"){
                this.status = 404 ;
                this.message = "User was not found in the database" ;
                winston.verbose("User not found at /user/timelines , request : "+JSON.stringify(this.request.query));
            } else {
                // unknown error
                throw e ;
            }
        }
    })

    krouter_api.get('/timeline/:timelineid/', function* (next){
        winston.debug("Received /timeline/"+this.params.timelineid+"/ request : "+JSON.stringify(this.request.query));
        let timelineid = Number(this.params.timelineid);
        if (!isNaN(timelineid)){
            let user_id = this.request.query.id || this.request.query.user_id || this.request.query.userid ;
            let credentials_key = this.request.query.credentials_key ;
            let is_connected = yield* utils.checkCredentials(user_id,credentials_key);
            if (is_connected){
                let timeline = yield db.Timeline.findOne({where:{'owner':user_id,'id':timelineid}}) ;
                if (timeline){
                    this.body = {"timeline":JSON.parse(timeline.timeline)};
                } else {
                    this.status = 404;
                    this.message = "Timeline not found"
                }
            } else {
                this.status = 401 ;
                this.message = "Bad credentials to access this data" ;
            }
        } else {
            this.status = 400 ;
            this.message = "Invalid 'timeline' parameter" ;
        }
    })

    krouter_api.post('/timeline/:timelineid/', function* (next){
        winston.debug("Received POST /timeline/"+this.params.timelineid+"/ request : "+JSON.stringify(this.request.body));
        let timelineid = Number(this.params.timelineid);
        let user_id = this.request.body.id || this.request.body.user_id || this.request.body.userid ;
        let credentials_key = this.request.body.credentials_key ;
        if (!isNaN(timelineid)){
            try {
                let timeline = JSON.parse(this.request.body.timeline)
                // parsing of the JSON object jsut to make sure it's valid, and not total crap is sent to the db
                let is_connected = yield* utils.checkCredentials(user_id,credentials_key);
                if (is_connected){
                    let result = yield db.Timeline.update({timeline:JSON.stringify(timeline),last_modified:Date.now()},{where:{'owner':user_id,'id':timelineid}}) ;
                    let affectedCount = result[0]
                    if (affectedCount === 0 ){
                        this.status = 404;
                        this.message = "Timeline not found"
                    } else if (affectedCount === 1 ) {
                        this.body = {"message":"Successfully updated timeline"};
                    }
                } else {
                    this.status = 401 ;
                    this.message = "Bad credentials to modify this data" ;
                }
            } catch (e){
                if (e instanceof SyntaxError){
                    this.status = 400 ;
                    this.message = "Could not parse JSON object 'timeline'" ;
                    winston.verbose("Could not parse JSON object : "+timeline);
                } else {
                    throw e ;
                }
            }
        } else {
            this.status = 400 ;
            this.message = "Invalid 'timeline' parameter" ;
        }
    })

    krouter_api.delete('/timeline/:timelineid/', function* (next){
        winston.debug("Received DELETE /timeline/"+this.params.timelineid+"/ request : "+JSON.stringify(this.request.body));
        let timelineid = Number(this.params.timelineid);
        if (!isNaN(timelineid)){
            let user_id = this.request.body.id || this.request.body.user_id || this.request.body.userid ;
            let credentials_key = this.request.body.credentials_key ;
            // parsing of the JSON object jsut to make sure it's valid, and not total crap is sent to the db
            let is_connected = yield* utils.checkCredentials(user_id,credentials_key);
            if (is_connected){
                winston.debug("(DELETE : user is connected, deleting timeline ...)");
                let affectedCount = yield db.Timeline.destroy({where:{owner:user_id,id:timelineid}}) ;
                if (affectedCount === 0 ){
                    winston.debug("(DELETE : timeline not found)");
                    this.status = 404;
                    this.message = "Timeline not found"
                } else if (affectedCount === 1 ) {
                    winston.debug("(DELETE : deleted timeline peacefully)");
                    this.body = {"message":"Successfully deleted timeline"};
                } else {
                    winston.error("(DELETE: Unexpected affectedCount be > than 1, what the fuck mate)")
                    throw Error("UNEXPECTED affectedCount be > than 1, this should never happen")
                }
            } else {
                winston.debug("(DELETE : user is not connected)");
                this.status = 401 ;
                this.message = "Bad credentials to delete this data" ;
            }
        } else {
            this.status = 400 ;
            this.message = "Invalid 'timeline' parameter" ;
        }
    })

    krouter_api.post('/timeline/', function* (next){
        winston.debug("Received POST /timeline/ request : "+JSON.stringify(this.request.body));
        let user_id = this.request.body.id || this.request.body.user_id || this.request.body.userid ;
        let credentials_key = this.request.body.credentials_key ;
        try {
            let timelineJSON = JSON.parse(this.request.body.timeline)
            // parsing of the JSON object jsut to make sure it's valid, and not total crap is sent to the db
            let is_connected = yield* utils.checkCredentials(user_id,credentials_key);
            if (is_connected){
                winston.debug("(POST : user is connected, proceding to update)");
                let timeline = yield db.Timeline.create({timeline:JSON.stringify(timelineJSON),owner:user_id,last_modified:Date.now()}) ;
                this.body = {"timelineid":timeline.id,message:"Successfully created timeline"};
            } else {
                winston.debug("(POST : user is not connected, deny him)");
                this.status = 401 ;
                this.message = "Bad credentials to create this data" ;
            }
        } catch (e){
            winston.debug("caught error for POST request");
            if (e instanceof SyntaxError){
                this.status = 400 ;
                this.message = "Could not parse JSON object 'timeline'" ;
            } else {
                throw e ;
            }
        }
    })

    krouter_api.post('/user/connect/',function *(next){
        winston.debug("Received /user/connect/ request : "+JSON.stringify(this.request.body));
        let username = this.request.body.username ;
        let email = this.request.body.email ;
        let userid = this.request.body.id || this.request.body.user_id || this.request.body.userid ;
        let password = this.request.body.password || "" ;
        // should be an already sha512'd password (done client side)
        let user = yield db.User.findOne({where :{"$or":{'id':userid,'username':username,'email':email}}});
        if (user == null){
            this.status = 404 ;
            this.message = "User was not found in the database, or invalid password" ;
            winston.verbose("Connection try failed, request : "+JSON.stringify({email,userid,username,password}));
        }else{
            let salted_password = utils.saltedPassword(password,user.salt);
            if (salted_password === user.password) {// good password my friend
                this.body = {"userid":user.id,"credentials_key":yield* utils.generateCredentials(user.id,user.password,user.salt)};
            } else {
                this.status = 404 ;
                this.message = "User was not found in the database, or invalid password" ;
                winston.verbose("User "+user.username+" tried to connect with wrong password '"+salted_password.substr(0,4)+"...', expected '"+user.password.substr(0,4)+"...'");
            }
        }
    })

    krouter_api.get('/', function *(next){
        let common_path = "/api";
        this.body = {
            "message":"api routes",
            "description":"This page lists every api route in this server",
            "routes":[
                {
                    method:"POST",
                    path:common_path+"/user/connect",
                    description:"Returns credentials_key based on login info",
                    parameters:"(email OR username OR (user_id OR userid OR id)) AND password::sha512password[0:32]"
                },
                {
                    method:"POST",
                    path:common_path+"/user/",
                    description:"Creates a new user",
                    parameters:"email AND username AND password::sha512password[0:32]"
                },
                {
                    method:"GET",
                    path:common_path+"/user/timelines/",
                    description:"Returns all timelines for connected user",
                    parameters:"credentials_key AND (user_id OR userid OR id)"
                },
                {
                    method:"POST",
                    path:common_path+"/timeline/",
                    description:"Creates a timeline",
                    parameters:"credentials_key AND (user_id OR userid OR id) AND timeline::string"
                },
                {
                    method:"GET",
                    path:common_path+"/timeline/:timeline_id/",
                    description:"Returns a timeline with the given timeline_id",
                    parameters:"credentials_key AND (user_id OR userid OR id) AND timeline_id"
                },
                {
                    method:"POST",
                    path:common_path+"/timeline/:timeline_id/",
                    description:"Modify an existing timeline",
                    parameters:"credentials_key AND (user_id OR userid OR id) AND timeline_id"
                }
            ]}
    })

    return krouter_api ;
}
