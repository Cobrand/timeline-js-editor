#!/usr/bin/env node

let path = require('path');
let koa = require("koa");
let koa_mount = require('koa-mount');
let krouter_api = require("koa-router")();
let serve = require("koa-static");
let koa_bodyparser = require("koa-bodyparser");
let api = koa();
let app = koa();
let program = require("commander");
let DEFAULT_PORT = 8080 ;

program
    .version('0.0.0')
    .option("-p, --port <n>","sets which port the application listens to (default 8080)",(n) => parseInt(n),DEFAULT_PORT)
    .parse(process.argv);

// ROUTES
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
        this.status = 404;
    }
})

// MIDDLEWARE
api.use(function* (next){
    yield next;
    if (this.status >= 200 && this.status <= 299){
        this.body.status = "ok" ;
    } else if (this.status >= 400 && this.status <= 499 ){
        this.body = {status:"error",message:"not found"}
    } else if (this.status >= 500) {
        this.body = {status:"error",message:"internal server error"}
    }
})
api.use(koa_bodyparser());
api.use(krouter_api.routes());

// mount the API under /api
app.use(koa_mount('/api',api));

// static file delivery
// WHY ??
app.use(serve('.'));
// WHY DOES THIS WORK ??? SERIOUSLY I DONT UNDERSTAND ????

app.listen(program.port);
console.info("Starting server, listening on port "+program.port);
