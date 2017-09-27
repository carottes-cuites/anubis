"use strict";
process.env.NODE_ENV = 'production';
console.log('Environment : "' + process.env.NODE_ENV +'"');

const Anubis =require("./src/2/anubis.js")
const Configuration = require("./src/loader/configuration.js");

class Main {

	constructor() {
		this.init();
	}

	init() {
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

var app = new Main();

app.prepare();
app.ready();
app.run();