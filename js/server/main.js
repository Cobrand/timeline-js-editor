#!/usr/bin/env node
"use strict";

let winston = require("winston");

function start(){
    let program = require("commander");
    let app = require('./koa/init.js')();

    app.listen(program.port);
    winston.info("Starting server, listening on port "+program.port);
}

module.exports = {
    start:start
}

if (require.main === module){
    winston.info("not loaded as a module");
    start();
} else {
    winston.info("loaded as a module, will not start until explicitly called");
}
