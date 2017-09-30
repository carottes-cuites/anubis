"use strict";

var Player = require("./../player/player.js");

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
        var text = undefined;
        this.guild.channels.forEach(
            chan => {
                if(chan.type == 'text' && chan.name == this.config.text.name) text = chan;
            }
        )
        if (text == undefined) {
            text = this.guild.defaultChannel;
            console.error('Text channel missing.\nPlease create "' + this.config.text.name + '" text channel.');
            this.communicator.message(
                text,
                'Text channel missing.\nPlease create "' + this.config.text.name + '" text channel.'
            );
        }
        return text;
    }

    get voice() {
        var voice = undefined;
        this.guild.channels.forEach(
            chan => {
                if(chan.type == 'voice' && chan.name == this.config.voice.name) voice = chan;
            }
        )
        if (voice == undefined) {
            console.error('Voice channel missing.\nPlease create "Music" voice channel.');
            this.communicator.message(
                this.text,
                '!!! Voice channel missing. Please create "' + this.config.voice.name + '" voice channel. !!!'
            );
        }
        return voice;
    }
}