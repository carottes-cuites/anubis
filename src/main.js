"use strict";

let i18n = require("i18n"),
	Anubis = require("./bot/anubis.js"),
	Configuration = require("./loader/configuration.js"),
	PromiseFinally = require("promise.prototype.finally");

module.exports = class Main {

	constructor() {
		this.init();
	}

	init() {
		PromiseFinally.shim();
        let env = process.env.NODE_ENV == undefined ? "development" : process.env.NODE_ENV;
		console.log('Environment defined : "' + env +'"');
		this.config = new Configuration();
		this.anubis = new Anubis(this.config);
		i18n.configure({
			//locales: ['en'],
			defaultLocale: 'en',
			autoReload: true,
			directory: "./resources/i18n",
			indent: "\t"
		});
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