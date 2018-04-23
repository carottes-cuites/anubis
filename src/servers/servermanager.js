"use strict";

var Server = require("./server.js");
module.exports = class ServerManager {
    constructor(anubis) {
        this.bot = anubis.bot;
        this.chanConfig = anubis.config.discord.channel;
        this.communicator = anubis.communicator;
        this.init();
    }

    init() {
        this.servers = {};
    }

    addServer(guild) {
        this.servers[guild.id] = new Server(guild, this.bot, this.communicator, this.chanConfig);
        return this.servers[guild.id];
    }

    removeServer(id) {
        delete this.servers[id];
    }

    /**
     * 
     * @param {String} id 
     * @return {Server} Wanted server.
     */
    getServer(id) {
        return this.servers[id];
    }
}