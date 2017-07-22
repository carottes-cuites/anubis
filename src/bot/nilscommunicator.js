module.exports = class NilsCommunicator {
	constructor(nils) {
		this.nils = nils;
		this.init();
	}

	init() {

	}

	sendMessage(content, destination) {
		//send 'content' message to 'destination'.
	}

	formatMessage(content) {
		//format 'content' message.
		return content;
	}
}