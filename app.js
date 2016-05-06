#!/usr/bin/env node
"use strict";

if (require.main === module){
    require("./js/server/main.js").start();
} else {
    module.exports = require("./js/server/main.js")
}
