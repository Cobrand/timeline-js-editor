#!/usr/bin/env node

let koa = require("koa");
let krouter = require("koa-router")();
let koa_bodyparser = require("koa-bodyparser");
let app = koa();
let program = require("commander");
let DEFAULT_PORT = 8080 ;

program
    .version('0.0.0')
    .option("-p, --port <n>","sets which port the application listens to (default 8080)",(n) => parseInt(n),DEFAULT_PORT)
    .parse(process.argv);

// ROUTES
krouter.get('/timeline/:timelineid', function* (next){
    let query = this.request.query ;
    let params = this.params ;
    let timelineid = params.timelineid;
    this.body = {"json":{}}
})

krouter.get('/connect/:userid',function *(next){
    let userid = this.params.userid ;
    if (userid == "800815"){
        this.body = {"validation_key":"EXAMPLE KEY_HERE"}
    }else{
        this.status = 404;
    }
})

// MIDDLEWARE
app.use(function* (next){
    yield next;
    if (this.status >= 200 && this.status <= 299){
        this.body.status = "ok" ;
    } else if (this.status >= 400 && this.status <= 499 ){
        this.body = {status:"error",message:"not found"}
    } else if (this.status >= 500) {
        this.body = {status:"error",message:"internal server error"}
    }
})
app.use(koa_bodyparser());
app.use(krouter.routes());

app.listen(program.port);
console.info("Starting server, listening on port "+program.port);
