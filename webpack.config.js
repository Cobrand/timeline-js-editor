const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const PROD = (process.argv.indexOf("--prod") !== -1 ||
              process.argv.indexOf("--release") !== -1);

module.exports = {
    entry: {
        main: "main.js",
        vendor: ["react", "react-dom", "backbone", "moment", "filesaver.js"]
    },
    resolve: {
        root: path.resolve("js/client")
    },
    output: {
        path: path.join(__dirname,"static"),
        filename: "js/app.js"
    },
    devtool: "source-map",
    eslint: {
        configFile: ".eslintrc.yaml"
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: "eslint",
                exclude: /node_modules/
            }
        ],
        loaders: [{
            test: /\.jsx?$/, // compiles jsx+ES6 into browser compatible ES5
            exclude: /(node_modules)/,
            loader: "babel"
        },{
            test: /backbone\.js$/,
            loader: "imports?define=>false"
        },
        {
            test: /\.json$/,
            loader: "json"
        },
        {
            test: /\.(png|jpg)$/, // transforms require("imgpath") into urls
            loader: "url?limit=25000"
        },
        {
            test: /\.s[a|c]ss$/, // must have scss to css compiler
            loader: ExtractTextPlugin.extract("css?sourceMap!sass?sourceMap")
        },
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("css?sourceMap")
        }
        ]
    },
    plugins:  (PROD ? [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ] : [
    ]).concat([
        new webpack.IgnorePlugin(/^jquery$/),
        new webpack.optimize.CommonsChunkPlugin("vendor", "js/vendor.js"),
        new ExtractTextPlugin("css/app.css", {
            allChunks: true
        })
    ])
};
