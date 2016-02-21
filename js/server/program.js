"use strict";
let program = require("commander");
let options = require("./options.js");

program
    .version('0.0.0')
    .option("-p, --port <n>","sets which port the application listens to (default 8080)",(n) => parseInt(n),options.port)
    .option("-d, --dev","runs the app in dev mode (errors will be displayed to the client)")
    .parse(process.argv);

module.exports = program ;
