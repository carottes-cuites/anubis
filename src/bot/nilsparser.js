const Tool = require("../misc/tool.js");
const Pattern = require("../../config/pattern.json");
const Methods = require("../../config/method.json");

module.exports = class NilsParser {

	constructor(streamer) {
		this.streamer = streamer;
		this.init();
	}

	init() {
		/*
		* Array of patterns's name associated to a specific id
		* which related to a function to be plugged to.
		*/
		this.patterns = new Array();
		this.failMethod = {
			id: "FAIL_METHOD",
			method: this.failMethodMatch,
			parameters: {}
		}
	}

	prepare() {
		this.associatePatternsToMethod();
	}

	/**
	*	Return the function associated with the 
	*/
	translate(message)  {
		return this.streamer.getMethod("DROPBOX");
		var pattern;
		// Pattern is associated to a pattern...
		// HERE lies the magic of algorithm..
		var method = this.streamer.getMethod(pattern.method);
		if (typeof method !== 'undefined') func = method;
		else method = this.failMethod; 
		return method;
	}


	failMethodMatch() {
		console.log("Failed to match a pattern to a method. "
		+ "Please check the 'pattern.json' file or update the NilsStream class");
	}

	/*
	* Get patterns from a config file and plug every text pattern to the associate method.
	*
	*/
	associatePatternsToMethod () {
		this.patterns = Pattern.data;
	}
}