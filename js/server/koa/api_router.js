"use strict";
let krouter_api = require("koa-router")();

// ALL ROUTES HERE
module.exports = function(){
    krouter_api.get('/timeline/:timelineid', function* (next){
        let query = this.request.query ;
        let params = this.params ;
        let timelineid = params.timelineid;
        this.body = {"json":{}}
    })

    krouter_api.get('/connect/:userid',function *(next){
        let userid = this.params.userid ;
        if (userid == "800815"){
            this.body = {"validation_key":"EXAMPLE KEY_HERE"}
        }else{
            this.status = 404 ;
        }
    })
    return krouter_api ;
}
