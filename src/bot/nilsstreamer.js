const StreamerDeezer = require('../stream/streamerdzr.js');
const StreamerDropbox = require('../stream/streamerdbx.js');
const ServerQueue = require('../server/serverqueue.js');

module.exports = class NilsStreamer {
	constructor(nils) {
		this.nils = nils;
		this.init();
	}

	init() {
		this.dzr = new StreamerDeezer(this.nils);
		this.dbx = new StreamerDropbox(this.nils);
		this.servers = new Array();
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
				method: (message, param) => { this.defaultStream(param); },
				parameters: {}
			},
			{
				id: "DROPBOX",
				method: (message, path) => { this.dbx.streamFile(path); },
				parameters: "son.mp3"
			},
			{
				id: "DEEZER",
				method: (message) => { this.dzr.stream(message); },
				parameters: {}
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

	getServer(id) {
		var serverQueue = undefined;
		this.servers.forEach(elem => {
			if(elem.id == id) {
				serverQueue = elem.queue;
			}
		});
		if(serverQueue === undefined) {
			serverQueue = new ServerQueue(id, this.nils)
			this.servers.push({
				id: id,
				queue: serverQueue
			});
		}
		return serverQueue;
	}
}