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
		this.bot = new Discord.Client();
		this.streamer = new NilsStreamer(this);
		this.parser = new NilsParser(this.streamer);
		this.communicator = new NilsCommunicator(this.bot);
	}

	prepare() {
		this.streamer.prepare();
		this.parser.prepare();
	}

	ready() {
		this.setEvents();
	}

	connect () {
		Tool.debugBot("Nils", 'Start communication with "Discord" server...');
		this.bot.login(this.config.discord.token);
	}

	setEvents() {
		this.bot.on('ready', () => {
			this.clientReady();
		});
		this.bot.on('message', (message) => {
			if (!message.author.bot && this.isNilsConcerned(message.content)) {
									//&& message.content.startsWith(this.config.nils.trigger)) {
				this.messageReceived(message);
			}
		});
	}
	
	isNilsConcerned(message) {
		return message.includes('@' + this.bot.user.username) || message.includes(this.bot.user.id);
	}

	clientReady() {
		Tool.debugBot("Nils", 'Bot logged in and ready.');
		var vc = this.bot.channels.filter(chan => {
	    		return chan.type == 'voice' && chan.name == this.config.discord.channel.voice.name;
			}).first();
		this.communicator.connectVoiceChannel(vc);
		Tool.debug("Bot id : "+this.bot.user.username);
	}

	messageReceived(message) {
		var msg = message.content;
		Tool.debugBot("Nils", 'Message received "' + msg +'".');
		
		/**
		* Define an adapter which will return the method to use,
		* according to the text patern catched inthe message.content.
		*/
		var translated = this.parser.translate(msg);
		translated.method(message, translated.parameters);

		this.communicator.sendMessage(
			"Message received",
			message.channel
		)
	}
}