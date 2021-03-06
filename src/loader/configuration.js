"use strict";

const config = require("./../../resources/data/config/config.json");

module.exports = class Configuration {

	constructor() {
		this.init();
	}

	init() {
		this.discord = config.discord;
		this.dropbox = config.dropbox;
		this.bot = config.bot;
		this.twitch = config.twitch;
		this.spotify = config.spotify;
		this.youtube = config.youtube;
	}
}