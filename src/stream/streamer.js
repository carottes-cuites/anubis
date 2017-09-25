const fs = require("fs");
const request = require("request");

module.exports = class Streamer {

	constructor(nils) {
		this.nils = nils;
		this.init();
	}

	init() {

	}

	voiceChannel() {
		return this.nils.communicator.voiceChannel;
	}

	streamAudio(path) {
		console.log("Stream audio at " + path);
		this.voiceChannel().join()
			.then(connection => {
				return connection.playStream(path);
			})
			.then(dispatcher => {

				//Handle queue list behavior from here
				dispatcher.on('end', () => {
					console.log("Stream end.");
					//if(typeof endCallback === "function") endCallback();
				});
				dispatcher.on('speaking', () => {
					console.log("Streaming...");
				});
				dispatcher.on('start', () => {
					console.log("Stream starts...");
				});
				dispatcher.on('error', console.error);
			})
			.catch(console.error);
	}

	playAudio(path) {
		console.log("Play audio at " + path);
		this.voiceChannel().join()
			.then(connection => {
				return connection.playFile(path);
			})
			.catch(console.error);
	}
}