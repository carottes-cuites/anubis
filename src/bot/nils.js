const Discord = require("discord.js");
const NilsParser = require("./nilsparser.js");
const NilsStreamer = require("./nilsstreamer.js");
const NilsCommunicator = require("./nilscommunicator.js");
const Tool = require("../misc/tool.js");

module.exports = class Nils {

	constructor (config) {
		this.config = config;
		this.init();
	}

	init () {
		Tool.debugBot("Nils", "Initiating...");
		this.eventSets = false;
		this.voiceChannel = {};
		this.bot = new Discord.Client();
		this.streamer = new NilsStreamer(this);
		this.parser = new NilsParser(this.streamer);
		this.communicator = new NilsCommunicator(this);
	}

	prepare() {
		this.streamer.prepare();
		this.parser.prepare();
	}

	ready() {
		this.setEvents();
	}

	connect () {
		if (!this.eventSets) {
			Tool.debugBot("Nils", "Events are not set.");
			return;
			// Handle this with a throw error.
		}
		Tool.debugBot("Nils", 'Start communication with "Discord" server...');
		this.bot.login(this.config.discord.token);
	}

	setEvents() {
		this.bot.on('ready', () => {
			this.clientReady();
		});
		this.bot.on('message', (message) => {
			if(!message.author.bot || message.content.startsWith(this.config.nils.trigger)) {
				this.messageReceived(message);
			}
		});
		this.eventSets = true;
	}

	clientReady() {
		Tool.debugBot("Nils", 'Bot logged in and ready.');
		this.voiceChannel = this.bot.channels.filter(chan => {
	    	return chan.type == 'voice' && chan.name == this.config.discord.channel.voice.name;
		}).first();
		this.voiceChannel.join()
			.then(connection => {
				Tool.debugBot("Nils", 'Joined channel "' + this.voiceChannel.name + '".');
			})
			.catch(console.error);
	}

	messageReceived(message) {
		var msg = message.content;
		Tool.debugBot("Nils", 'Message received "' + msg +'".');
		
		/**
		* Define an adapter which will return the method to use,
		* according to the text patern catched inthe message.content.
		*/
		var translated = this.parser.translate(msg);
		translated.method(translated.parameters);

		this.communicator.sendMessage(
			"Message received",
			message.channel
		)
		this.responseTo(message, "Message received");
	}

	responseTo(inputMessage, response, to) {
		if (typeof to === 'undefined') to = '';
		switch (to) {
			case 'author':
			default:
				inputMessage.channel.send(response)
					.then(() => {
						Tool.debugBot("Nils", "Reply sent.");
					})
					.catch(console.error);
			break;
		}
	}
}