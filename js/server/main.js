#!/usr/bin/env node
"use strict";

let program = require("commander");
let app = require('./koa/init.js')();
let winston = require("winston");

app.listen(program.port);
winston.info("Starting server, listening on port "+program.port);
