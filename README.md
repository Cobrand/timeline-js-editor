Timelinizator,
a web interface to create timelines powered by [Timeline JS](https://timeline.knightlab.com/)

[![build status](https://gitlab.univ-nantes.fr/ci/projects/5/status.png?ref=master)](https://gitlab.univ-nantes.fr/ci/projects/5?ref=master)

# HOW TO DEV

As any nodejs project, it depends on many other libraries required to build the project, to install them you must do :

    # Install dependencies in package.json
    $ npm install

It also needs webpack to build the client-side javascript file

    # Install the command line tools
    # sudo npm install -g webpack
    
If you don't have root access, you can still access the webpack executable at this path ( given that your current directory is this project's root) : `node_modules/webpack/bin/webpack.js` 

Once you have installed webpack, you can start building the app as you wish :

## Continuous build :

This will allow you to dev on this project easily.
It will reload the server and rebuild the client-side javascript file every time
you modify a source file. It is not recommended for production use, since it 
"watches" all your files in the source tree, hence it will use more ressources
than the vanilla build

You have to run these two scripts side by side :

### Autonomous static server

Allows you to the server to reload automatically (with nodemon)

```bash
$ npm start
```

It will be hosted on port 8080 by default. You can have access to various
command-line parameters. To display them, a very simple `npm start -- -h` will
do. Be sure to include the "--" otherwise it will display npm's help and not
this project's help.

For example if you want a custom port you can do

```bash
$ npm start -- --port 61080
```

If you don't want to write your DB credentials in the server_config.js file,
you can input them here by executing :

```bash
$ npm start -- --username "username" --password "yourpassword" --host "mariadb.yourwebsite.whatever" --db-port 54263
```

### Auto reload

To keep track of the changes done to the client-side source, and recompile every
time a meaningful change is done, keep this in a separate terminal :

```bash
$ webpack --progress --colors --watch
```

## Simple build

If you don't want to watch your client-side files but only build once, (for
production for instance) you can simply do :

```bash
$ webpack --progress --colors
```

You can then run the server as you wish :

    $ node js/server/main.js [OPTIONS]
    
For example :

    $ node js/server/main.js --port 8080 --logging warning

# HOW TO BUILD FOR PROD

You can minify the js files within the compilation with this option :

    $ webpack --progress --colors --prod

*Warning* : adding the --prod tag takes a much longer time. Then
to launch the server you can do as usual :

    $ node js/server/main.js --port 8080

# SETUP

Make a copy of the "server_config_example.js" file  and rename it as "server_config.js"
in the root directory :

$ cp server_config_example.js server_config.js

Then fill the info as needed. Example of a server_config.js file :

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

Depending on what SQL db you using, you might need to install some additional 
package when starting this application :

```sh
$ npm install pg pg-hstore
$ npm install mysql // For both mariadb and mysql dialects
$ npm install sqlite3
$ npm install tedious // MSSQL
```

# LICENSE

MIT

