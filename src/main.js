"use strict";

const Anubis = require("./bot/anubis.js")
const Configuration = require("./loader/configuration.js");

module.exports = class Main {

	constructor() {
		this.init();
	}

	init() {
		console.log('Environment defined : "' + process.env.NODE_ENV +'"');
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