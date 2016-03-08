"use strict";
let db = require('./db.js');
let sha512 = require('sha512');
let winston = require("winston");

function UserNotFoundError(message){
    this.name = 'UserNotFoundError';
    this.message = message || "User wasn't found in the database";
    this.stack = (new Error()).stack;
}
UserNotFoundError.prototype = new Error;

module.exports = {
    checkCredentials:function* (id,credentials_key){
        let user ;
        if (typeof id === "object"){
            // if first parameter is object, then dont retrieve anything
            user = id ;
        } else { // if first parameter is only an id, retrieve the remaining
            user = yield db.User.findById(id);
        }
        if (!!user){
            let is_login_correct = sha512(user.id.toString(16)+user.salt+user.password).toString('hex').substr(0, 32) === credentials_key ;
            winston.debug("checkCredentials : login for user "+id+" is "+is_login_correct ? "true" : "false");
            return sha512(user.id.toString(16)+user.salt+user.password).toString('hex').substr(0, 32) === credentials_key ;
        }else{
            winston.debug("checkCredentials : user_id wasnt found in the db");
            throw new UserNotFoundError();
        }
    },
    generateCredentials:function* (id, salted_password, salt){
        let user ;
        if (!!salted_password && !!salt){
            user = yield db.User.findById(id);
        } else {
            user = {id,salted_password,salt};
        }
        if (!!user){
            winston.debug("generateCredentials : generated credentials for "+user.id);
            return sha512(user.id.toString(16)+user.salt+user.password).toString('hex').substr(0, 32) ;
        }else{
            winston.debug("generateCredentials : could not generate credentials for "+user.id+" : user not found");
            throw new UserNotFoundError();
        }
    },
    saltedPassword:function(password,salt){
        let salted_password = sha512(password + salt).toString('hex').substr(0,32);
        return salted_password;
    }
}
