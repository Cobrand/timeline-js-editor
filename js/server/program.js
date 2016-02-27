"use strict";
let program = require("commander");
let options = require("./options.js");
let winston = require("winston");

program
    .version('0.0.0')
    .option("-p, --port <n>","sets which port the application listens to (default 8080)",(n) => parseInt(n),options.port)
    .option("--host <s>","where the application's db is (default is localhost)",options.host)
    .option("-d, --dialect [s]","which kind of db will the application use. Can be : mysql, mariadb, sqlite, postgres or mssql",/^(mysql|mariadb|sqlite|postgres|mssql)$/,options.db.dialect)
    .option("-u, --username [s]","username used to connect to the db",options.db.username)
    .option("--password [s]","password used to connect to the db",options.db.password)
    .option("--database [s]","name of database to use inside the db",options.db.database)
    .option("--storage <s>","path to the database (sqlite only)",options.db.storage)
    .option("-z, --dev","runs the app in dev mode (errors will be displayed to web clients)")
    .option("-l, --logging [level]","sets the logging level for the app, (can be 'error','warn','info','verbose','debug' or 'silly'), default 'info', 'verbose' in dev mode",/^(error|warn|info|verbose|debug|silly|default)$/,"default")
    .option("-o, --output <file>","which file to log to instead of standard output")
    .option("--keep-standard-output","only with --output option, will keep outputing to standard output when a file is specified")
    .parse(process.argv);

//winston.loggers.default.transports[0].colorize = true ;
//colorize console output
if (program.logging === "default"){
    if (program.dev){
        winston.level = "verbose";
        winston.info("Running the app in dev mode, expect verbose");
    } else {
        winston.level = "info";
    }
} else {
    winston.level = program.logging;
    if (program.dev){
        winston.info("Running the app in dev mode with non-default '"+winston.level+"' logging")
    }
}

if (program.output){
    winston.info("Outputing logs to "+program.output);
    winston.add(winston.transports.File, { filename: program.output , json:false});
    if (!program["keepStandardOutput"]){
        winston.remove(winston.transports.Console);
    }
}

module.exports = program ;
