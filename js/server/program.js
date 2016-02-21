"use strict";
let program = require("commander");
let options = require("./options.js");

program
    .version('0.0.0')
    .option("-p, --port <n>","sets which port the application listens to (default 8080)",(n) => parseInt(n),options.port)
    .option("-h, --host <s>","where the application's db is (default is localhost)",options.host)
    .option("-d, --dialect [s]","which kind of db will the application use. Can be : mysql, mariadb, sqlite, postgres or mssql",/^(mysql|mariadb|sqlite|postgres|mssql)$/,options.db.dialect)
    .option("-u, --username [s]","username used to connect to the db",options.db.username)
    .option("--password [s]","password used to connect to the db",options.db.password)
    .option("--database [s]","name of database to use inside the db",options.db.database)
    .option("--storage <s>","path to the database (sqlite only)",options.db.storage)
    .option("-z, --dev","runs the app in dev mode (errors will be displayed to the client)")
    .parse(process.argv);
console.info("INFO: Running the app in dev mode, expect verbose");

module.exports = program ;
