const path = require("path");
const webpack = require("webpack");

const PROD = process.argv.indexOf('--prod') !== -1;

module.exports = {
    entry: "main.js",
    resolve: {
        root: path.resolve("js")
    },
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devtool: 'source-map',
    eslint: {
        configFile: '.eslintrc'
    },
    module: {
        //preLoaders: [
        //    {
        //        test: /\.js$/,
        //        loader: "eslint-loader",
        //        exclude: /node_modules/
        //    },
        //],
        loaders: [{
            test: /\.jsx?$/, // compiles jsx+ES6 into browser compatible ES5
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        },{
            test: /backbone\.js$/,
            loader: 'imports?define=>false'
        },
        {
            test: /\.(png|jpg)$/, // transforms require("imgpath") into urls
            loader: 'url?limit=25000'
        },
        {
            test: /\.s[a|c]ss$/, // must have scss to css compiler
            loader: 'style!css!sass'
        }
    ]
    },
    plugins:  PROD ? [
        new webpack.optimize.UglifyJsPlugin({minimize:true}),
        new webpack.IgnorePlugin(/^jquery$/)
    ] : [
    new webpack.IgnorePlugin(/^jquery$/)
    ]
};
