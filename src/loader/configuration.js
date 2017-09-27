"use strict";

const config = require("../../resources/data/config/config.json");

module.exports = class Configuration {

	constructor() {
		this.init();
	}

	init() {
		this.discord = config.discord;
		this.dropbox = config.dropbox;
		this.nils = config.nils;
		this.twitch = config.twitch;
	}
}