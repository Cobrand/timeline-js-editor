var path = require("path");
var webpack = require("webpack");

var PROD = process.argv.indexOf('--prod') === -1 ? false : true;

module.exports = {
	entry: "./js/main.js",
	output: {
		path: __dirname,
		filename: "bundle.js"
	},
    eslint: {
        configFile: '.eslintrc'
    },
	module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            },
        ],
        loaders: [
				{ 
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader' 
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
