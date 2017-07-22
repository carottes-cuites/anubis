const Tool = require("../misc/tool.js");

module.exports = class NilsCommunicator {
	constructor(nils) {
		this.nils = nils;
		this.init();
	}

	init() {

	}

	sendMessage(content, destination) {
		destination.send(this.formatMessage(content))
			.then(elem => {
				Tool.debugBot("Nils", 'Reply sent "' + elem.content +'".');
			})
			.catch(console.error);
	}

	formatMessage(content) {
		//format 'content' message.
		return content;
	}
}