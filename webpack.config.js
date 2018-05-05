//Defining properties.
let webpack = require('webpack'),
    path = require('path'),
    fs = require('fs'),
    WebpackAutoInject = require('webpack-auto-inject-version'),
    UglifyJSPlugin = require("uglifyjs-webpack-plugin"),
    nodeModules = {},
    config = {};
//Compiling node_modules.
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    }).forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });
//Writing configuration.
config = {
    entry: './src/index.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'app.js'
    },
    plugins: [
        new WebpackAutoInject(
            {
                components: {
                    AutoIncreaseVersion: true
                },
                componentsOptions: {
                    AutoIncreaseVersion: {
                        runInWatchMode: false
                    }
                  }
            }
        )
    ],
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
//Uglyfying code.
if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new UglifyJSPlugin()
    );
}
//Exporting config.
module.exports = config;