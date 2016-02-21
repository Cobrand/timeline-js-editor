#!/usr/bin/env node
"use strict";

let program = require("commander");
let app = require('./koa/init.js')();

app.listen(program.port);
console.info("Starting server, listening on port "+program.port);
