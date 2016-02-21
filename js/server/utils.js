"use strict";
let db = require('./db.js');
let sha512 = require('sha512');

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
            return sha512(user.id.toString(16)+user.salt+user.password).toString('hex').substr(0, 32) === credentials_key ;
        }else{
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
            return sha512(user.id.toString(16)+user.salt+user.password).toString('hex').substr(0, 32) ;
        }else{
            throw new UserNotFoundError();
        }
    },
    saltedPassword:function(password,salt){
        let salted_password = sha512(password + salt).toString('hex').substr(0,32);
        return salted_password;
    }
}
