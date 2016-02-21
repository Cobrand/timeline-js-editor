"use strict";

let koa = require("koa");

module.exports = function(program){
    let api = koa();
    let app = koa();

    require('./middlewares.js')(app,api,program);
    return app ;
}
