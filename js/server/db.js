"use strict";

let options = require('./program.js');
let Sequelize = require("sequelize");

if (!!options.dialect && !!options.database ){
    let sequelize = new Sequelize(options.database,options.username,options.password,{
        host:options.host,
        dialect:options.dialect
    });
    module.exports = sequelize ;
} else {
    console.error("ERROR: Dialect and database name are needed to start the app")
    console.error("Please include them as command line option or in the config file (server_config.js)")
    process.exit(1);
}
