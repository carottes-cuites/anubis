"use strict";

let Player = require("./../player/player.js"),
    Communicator = require("./../dialog/communicator.js");

module.exports = class Server {
    /**
     * 
     * @param {*} guild 
     * @param {Client} bot 
     * @param {Communicator} communicator 
     * @param {*} config 
     */
    constructor(guild, bot, communicator, config) {
        this.bot = bot;
        this.guild = guild;
        this.communicator = communicator;
        this.config = config;
        this.init();
    }

    init() {
        this.mPlayer = new Player(this);
    }

    /**
     * @return {Player}
     */
    get player() {
        return this.mPlayer;
    }

    /**
     * @return {TextChannel} Text channel.
     */
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

    /**
     * @return {VoiceChannel} Bot's dedicated voice channel.
     */
    get voice() {
        let voice = undefined;
        //If bot already exist in a voicechannel
        this.bot.voiceConnections.forEach(
            (voiceConnection) => {
                voiceConnection.channel.members.forEach(
                    (guildMember) => {
                        if (guildMember.user.id == this.bot.user.id) {
                            return voiceConnection.channel;
                        }
                    }
                )
            }
        );
        //If bot doesn't exist in another channel
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