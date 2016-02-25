"use strict";

let options = require('./program.js');
let Sequelize = require("sequelize");
let winston = require("winston");

if (!!options.dialect && !!options.database ){
    let sequelize = new Sequelize(options.database,options.username,options.password,{
        logging:false,
        host:options.host,
        dialect:options.dialect
    });

    let User = sequelize.define('user', {
        id:{type:Sequelize.INTEGER,primaryKey:true,autoIncrement:true,allowNull:false},
        username:{type:Sequelize.STRING(128),unique:true,allowNull:false},
        email:{type:Sequelize.STRING(128),unique:true,allowNull:false},
        password:{type:Sequelize.STRING(32),allowNull:false,comment:"password = sha512(sha512(raw_password)+salt)"},
        salt:{type:Sequelize.STRING(32),allowNull:false},
        joined:{type:Sequelize.DATE,allowNull:false,defaultValue: Sequelize.NOW,comment:"When the user first created his account"},
        last_connected:{type:Sequelize.DATE,comment:"When did the user last connect to the software"},
    },{timestamps: false,underscored: true,tableName: 'timeline_users'});

    let Timeline = sequelize.define('timeline', {
        id:{type:Sequelize.INTEGER,primaryKey:true,autoIncrement:true,allowNull:false},
        owner:{type:Sequelize.INTEGER,references:{model:User,key:'id'},allowNull:false},
        timeline:{type:Sequelize.TEXT},
        created:{type:Sequelize.DATE,allowNull:false,defaultValue: Sequelize.NOW,comment:"When was this timeline created"},
        last_modified:{type:Sequelize.DATE,comment:"When was this timeline last modified ?"},
    },{indexes:[{unique:false,fields:['owner']}],timestamps: false,underscored: true,tableName: 'timeline_timelines'});

    sequelize.sync().then(() => {

    }).catch((error) => {
        winston.error("ERROR: something something");
        throw error;
    });
    module.exports = {sequelize:sequelize,User:User,Timeline:Timeline} ;
} else {
    winston.error("ERROR: Dialect and database name are needed to start the app\n\
    Please include them as command line option or in the config file (server_config.js)")
    process.exit(1);
}
