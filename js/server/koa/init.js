"use strict";

let koa = require("koa");
let program = require("../program.js");

module.exports = function(){
    let api = koa();
    let app = koa();

    require('./middlewares.js')(app,api);
    return app ;
}