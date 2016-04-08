Timelinizator, a web interface to create timelines, using the library timeline.js

[![build status](https://gitlab.univ-nantes.fr/ci/projects/5/status.png?ref=master)](https://gitlab.univ-nantes.fr/ci/projects/5?ref=master)

# HOW TO DEV

To install dependencies required by this project:

    # Install dependencies in package.json
    npm install
    # Install the command line tools
    sudo npm install -g webpack

Then choose one :

## Continuous build :

Run side by side :

### Autonomous static server

Allows you to the server to reload automatically (with nodemon)

```bash
$ npm start
```

It will be hosted on port 8080.

If you want a custom port you will have to do instead :

```bash
$ ./node_modules/.bin/nodemon --use_strict js/server/main.js --port 61080
```

### Auto reload

If you want to host the server on a custom port, and only have the reloading done when a change is noticed, do :

```bash
$ webpack --progress --colors --watchify
```

## Simple build

If you don't want to watch but only build, you can just do :

    $ webpack --progress --colors

while being in the repository's directory, then to launch the server :

    $ node --use_strict js/server/main.js --port 8080

# HOW TO BUILD FOR PROD

You can minify the js files within the compilation with this option :

    $ webpack --progress --colors --prod

Warning : adding the --prod tag takes a much longer time. Then
to launch the server you can do :

    $ node --use_strict js/server/main.js --port 8080

# SETUP

Make a copy of the "server_config_example.js" file  and rename it as "server_config.js"
in the root directory :

$ cp server_config_example.js server_config.js

Then fill the info as needed. Example of server_config.js file :

```javascript

module.exports = {
    "port":9999, // Port this application will listen to
    "db":{
        "host":"localhost", // address of your SQL db
        "dialect":"sqlite", //'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
        "database":"timeline", // name of the database inside your SQL db
        "username":"username", // name of the user db
        "password":"password", // password of the user db
        "storage": "/var/sqlite/timeline.db"
    }
}

```

The db.storage field is only used when using sqlite3.

## Additional notes

Depending on what SQL db you using, you might need to install some additional package
when starting this application :

```sh
$ npm install pg pg-hstore
$ npm install mysql // For both mariadb and mysql dialects
$ npm install sqlite3
$ npm install tedious // MSSQL
```
