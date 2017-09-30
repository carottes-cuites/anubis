"use strict";

const Main = require("./src/main.js")
// npm config set anubis-bot:environment <env_name_here>
process.env.NODE_ENV = process.env.npm_package_config_environment;
if (process.env.NODE_ENV == undefined) process.env.NODE_ENV = "dev";

var app = new Main();
app.prepare();
app.ready();
app.run();
