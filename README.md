Timelinizator, a web interface to create timelines, using the library timeline.js

# HOW TO DEV

To install dependencies required by this project:

    # Install dependencies in package.json
    npm install
    # Install the command line tools
    sudo npm install -g webpack webpack-dev-server

Then choose one :

## Continuous build :

Make sure to have port 8080 open if you want to dev using webpack-dev-server

### Autonomous static server

Allows you to have a server that hosts your html and your files staticly (everything is visible)

```bash
$ webpack-dev-server --progress --colors
```

### Auto reload

If you want to host the server on a custom port, and only have the reloading done when a change is noticed, do :

```bash
$ webpack --progress --colors --watchify
```

## Simple build

If you don't want to watch but only build, you can just do :

    webpack --progress --colors

while being in the repository's directory

# HOW TO BUILD FOR PROD:

You can minify the js files within the compilation with this option :

    webpack --progress --colors --prod

Warning : this takes a much longer time
