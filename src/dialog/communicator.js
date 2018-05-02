//import { User } from "discord.js";

//import { TextChannel } from "discord.js";

"use strict";

var Essential = require("./../common/essential.js");

module.exports = class Communicator extends Essential {
    constructor(anubis) {
        super(anubis);
    }

    broadcast(content) {
        this.anubis.bot.guilds.forEach(guild => {
            this.message(guild.defaultChannel, content, []);
        });
    }

    /**
     * 
     * @param {TextChannel} channel Text channel to communicate to.
     * @param {message} content Messagr to share.
     * @param {*} focuses Deprecated parameter, prefer "privateMessage" method. Keep it "undefined".
     */
    message(channel, content, focuses) {
        channel.send(content).then(elem => {
            console.log('Message sent : "' + content + '"');
        }).catch(console.error);
    }

    /**
     * Send a private message
     * @param {User} receiver 
     * @param {String} content 
     */
    privateMessage(receiver, content) {
        receiver.sendMessage(content);
    }
}