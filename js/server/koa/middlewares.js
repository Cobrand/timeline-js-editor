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
            if (this.status >= 200 && this.status <= 299){
                this.body.status = "ok" ;
            } else if (this.status === 404 ){
                this.body = {status:"error",message:this.message || "not found"}
            } else if (this.status >= 400 && this.status <= 499 ){
                this.body = {status:"error",message:this.message}
            } else if (this.status >= 500) {
                if (program.dev){
                    this.body = {status:"error",message:this.message}
                } else{
                    this.body = {status:"error",message:"internal server error"}
                }
            }
        } catch (e) {
            if (program && program.dev){
                this.body = {status:"error",message:e.message,name:e.name,stack:e.stack.split("\n    ")}
            } else{
                this.body = {status:"error",message:"internal server error"}
            }
            winston.error("Unexpected error "+e.name+" : "+e.message);
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
