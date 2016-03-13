"use strict";

let koa_mount = require('koa-mount');
let koa_bodyparser = require("koa-bodyparser");
let serve = require("koa-static");
let program = require("../program.js");
let winston = require("winston");

module.exports = function(app,api){
    let krouter_api = require('./api_router.js')();

    api.use(function* (next){
        try {
            yield next;
            let status = this.status ;
            let message = this.message ;
            if (status >= 200 && status <= 299){
                this.body.status = "ok" ;
            } else if (status === 404 ){
                this.body = {status:"error",message:this.message || "not found"}
            } else if (status >= 400 && status <= 499 ){
                this.body = {status:"error",message:this.message}
            } else if (status >= 500) {
                if (program.dev){
                    this.body = {status:"error",message:this.message}
                } else{
                    this.body = {status:"error",message:"internal server error"}
                }
            }
            this.status = status ;
            this.message = message ;
        } catch (e) {
            if (program && program.dev){
                this.body = {status:"error",message:e.message,name:e.name,stack:e.stack.split("\n    ")}
            } else{
                this.body = {status:"error",message:"internal server error"}
            }
            winston.error("Unexpected error "+e.name+" : "+e.message);
            this.status = 500 ;
        }
    })
    api.use(koa_bodyparser());

    api.use(krouter_api.routes());

    // mount the API under /api
    app.use(koa_mount('/api',api));

    // static file delivery
    // WHY ??
    app.use(serve('.'));
    // WHY DOES THIS WORK ??? SERIOUSLY I DONT UNDERSTAND ????
}
