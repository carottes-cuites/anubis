const fs = require("fs");
const request = require("request");

module.exports = class Streamer {

	constructor(nils) {
		this.nils = nils;
	}

	init() {
		this.voiceChannel = this.nils.voiceChannel;
	}

	streamAudio(path) {
		console.log("stream audio");
		this.voiceChannel.join()
				.then(connection => {
					return connection.playFile(path);
				})
				.then(dispatcher => {
					dispatcher.on('end', () => {
						debug("Stream end.");
						//if(typeof endCallback === "function") endCallback();
					});
					dispatcher.on('speaking', () => {
						debug("Streaming...");
					});
					dispatcher.on('start', () => {
						debug("Stream starts...");
					});
					dispatcher.on('error', console.error);
				})
				.catch(console.error);
	}
}