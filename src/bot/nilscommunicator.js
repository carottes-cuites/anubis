const Tool = require("../misc/tool.js");

module.exports = class NilsCommunicator {
	constructor(bot) {
		this.bot = bot;
		this.init();
	}

	init() {
		this.voiceChannel = {};
	}

	setTextChannel() {
		console.log(this.bot.guilds);
	}

	connectVoiceChannel(vc) {
		this.voiceChannel = vc;
		this.voiceChannel.join()
			.then(connection => {
				Tool.debugBot("Nils", 'Joined channel "' + this.voiceChannel.name + '".');
				this.sendBroadcastMessage("I am alive and pumped up!");
				//this.sendMessage("I am alive and pumped up!", this.defaultChannel);
			})
			.catch(console.error);
	}

	sendBroadcastMessage(content) {
		this.bot.guilds.forEach(guild => {
			this.sendMessage(content, guild.defaultChannel);
		});
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