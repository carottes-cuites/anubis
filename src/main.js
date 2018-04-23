"use strict";

const Anubis = require("./bot/anubis.js")
const Configuration = require("./loader/configuration.js");

module.exports = class Main {

	constructor() {
		this.init();
	}

	init() {
        let env = process.env.NODE_ENV == undefined ? "development" : process.env.NODE_ENV;
		console.log('Environment defined : "' + env +'"');
		this.config = new Configuration();
		this.anubis = new Anubis(this.config);
	}

	prepare() {
		this.anubis.prepare();
	}

	ready() {
		this.anubis.ready();
	}

	run() {
		this.anubis.connect();
	}
}