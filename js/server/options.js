"use strict";
let fs = require("fs");
let path = require("path");
let winston = require("winston");
let options = {
    port:8080,
    db:{
        host:"localhost",
        dialect:"mariadb",//'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
        username:"root",
        password:""
    }
} ;
let config_filename = path.join(__dirname,"./../../","server_config.js") ;
try {
    if (fs.statSync(config_filename).isFile()){
        try {
            Object.assign(options,require(config_filename) || {});
        } catch (e) {
            winston.error("Unexpected error "+e.name+" : "+e.stack);
        }
    } else {
        winston.error("server_config.js file not found");
    }
} catch (e) {
    winston.error("server_config.js file not found; please create one with your own config");
    process.exit(1);
}

module.exports = options ;
