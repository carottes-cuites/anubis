var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
let UglifyJSPlugin = require("uglifyjs-webpack-plugin");

var nodeModules = {};
let config = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    }).forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });
config = {
    entry: './src/index.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'app.js'
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.json$/,
                include: [/resources/]
            },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, "src")],
                exclude: [/node_modules/, /build/, /resources/]
            }
        ]
    },
    externals: nodeModules
}
if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new UglifyJSPlugin()
    );
}

module.exports = config;