//const Nils = require("./src/bot/nils.js");
var Anubis =require("./src/2/anubis.js")
const Configuration = require("./src/loader/configuration.js");
//const Tool = require("./src/misc/tool.js");

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