"use strict";
let fs = require("fs");
let path = require("path")
let options = {
    port:8080,
    db:{
        host:"localhost",
        dialect:"mariadb",//'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
        database:"database_name",
        username:"username",
        password:"password"
    }
} ;
let config_filename = path.join(__dirname,"./../../","server_config.js") ;
try {
    if (fs.statSync(config_filename).isFile()){
        try {
            Object.assign(options,require(config_filename) || {});
        } catch (e) {
            console.error("ERROR["+e.name+"] "+e.stack);
        }
    } else {
        console.error("ERROR: server_config.js file not found");
    }
} catch (e) {
    console.error("ERROR: server_config.js file not found");
    console.error("please create one with your own config")
    process.exit(1);
}

module.exports = options ;
