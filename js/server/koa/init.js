"use strict";

let koa = require("koa");
let program = require("../program.js");
let winston = require("winston");

module.exports = function(){
    let api = koa();
    let app = koa();
    let timeline_router = koa();

    require('./middlewares.js')(app,api,timeline_router);
    return app ;
}
