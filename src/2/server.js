"use strict";

var Player = require("./player.js");

module.exports = class Server {
    constructor(guild, bot, communicator, config) {
        this.bot = bot;
        this.guild = guild;
        this.communicator = communicator;
        this.config = config;
        this.init();
    }

    init() {
        this.player = new Player(this);
    }

    get text() {
        return this.guild.defaultChannel;
    }

    get voice() {
        var voice = undefined;
        this.guild.channels.forEach(
            chan => {
                if(chan.type == 'voice' && chan.name == this.config.voice.name) voice = chan;
            }
        )
		/*var voice = this.bot.channels.filter(chan => {
	    		return chan.type == 'voice' && chan.name == "Bot";
            }).first();*/
        if (voice == undefined) {
            console.error('Voice channel missing. Please create "Music" voice channel.');
            this.communicator.message(
                this.text,
                'Voice channel missing. Please create "' + this.config.voice.name + '" voice channel.'
            );
        }
        return voice;
    }
}