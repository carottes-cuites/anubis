const Nils = require("./src/bot/nils.js");
const Configuration = require("./src/loader/configuration.js");
const Tool = require("./src/misc/tool.js");

class Main {

	constructor() {
		this.init();
	}

	init() {
		this.config = new Configuration();
		this.nils = new Nils(this.config);
	}

	prepare() {
		this.nils.prepare();
	}

	ready() {
		this.nils.ready();
	}

	run() {
		this.nils.connect();
	}
}

var app = new Main();

app.prepare();
app.ready();
app.run();