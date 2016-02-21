"use strict";
let fs = require("fs");
let path = require("path")
let options = {
    port:8080
} ;
let config_filename = path.join(__dirname,"./../../","server_config.json") ;
if (fs.statSync(config_filename).isFile()){
    try {
        Object.assign(options,require(config_filename) || {});
    } catch (e) {
        console.error("ERROR["+e.name+"] "+e.stack);
    }
} else {
    console.warn("WARNING: server_config.json file not found, taking default config")
}

module.exports = options ;
