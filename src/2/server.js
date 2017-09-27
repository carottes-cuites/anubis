"use strict";

var Player = require("./player.js");

module.exports = class Server {
    constructor(guild, bot, communicator) {
        this.bot = bot;
        this.guild = guild;
        this.communicator = communicator;
        this.init();
    }

    init() {
        this.player = new Player(this);
    }

    get text() {
        return this.guild.defaultChannel;
    }

    get voice() {
		var voice = this.bot.channels.filter(chan => {
	    		return chan.type == 'voice' && chan.name == "Music";
            }).first();
        if (voice == undefined) console.log('Voice channel missing. Please create "Music" voice channel.');
        return voice;
    }
}