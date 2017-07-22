const StreamerDeezer = require('../stream/streamerdzr.js');
const StreamerDropbox = require('../stream/streamerdbx.js');

module.exports = class NilsStreamer {
	constructor(nils) {
		this.nils = nils;
		this.init();
	}

	init() {
		this.dzr = new StreamerDeezer(this.nils);
		this.dbx = new StreamerDropbox(this.nils);
		/*
		* Array of functions associated to a specific id (function marker).
		* We should generate a "functionMap" by using "Grunt" tool and plug everything manually without code dependencies.
		*/
		this.methods = new Array();
	}

	prepare() {
		this.dzr.prepare();
		this.dbx.prepare();
		this.associateIDToMethod();
	}

	associateIDToMethod() {
		this.methods.push(
			{
				id: "FALLBACK",
				method: param => { this.defaultStream(param);},
				parameters: {}
			},
			{
				id: "DROPBOX",
				method: param => { this.dbx.streamFile(param);},
				parameters: "son.mp3"
			}
		);
	}

	getMethod(id) {
		var met = undefined;
		this.methods.forEach(method => {
			if (method.id == id) {
				met = method;
				return true;
			}
		});
		return met;
	}

	defaultStream() {
		Tool.debug("defaultStream");
	}
}