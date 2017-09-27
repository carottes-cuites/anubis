"use strict";

var Essential = require("./essential.js");

module.exports = class Communicator extends Essential {
    constructor(anubis) {
        super(anubis);
    }

    broadcast(content) {
        this.anubis.bot.guilds.forEach(guild => {
            this.message(guild.defaultChannel, content, []);
        });
    }

    message(channel, content, focuses) {
        channel.send(content).then(elem => {
            console.log('Message sent : "' + content + '"');
        }).catch(console.error);
    }
}