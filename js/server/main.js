#!/usr/bin/env node
"use strict";

let program = require("commander");
let DEFAULT_PORT = 8080 ;

program
    .version('0.0.0')
    .option("-p, --port <n>","sets which port the application listens to (default 8080)",(n) => parseInt(n),DEFAULT_PORT)
    .option("-d, --dev","runs the app in dev mode (errors will be displayed to the client)")
    .parse(process.argv);

let app = require('./koa/init.js')(program);

app.listen(program.port);
console.info("Starting server, listening on port "+program.port);
