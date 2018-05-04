"use strict";

let Discord = require("discord.js"),
    Interpreter = require("./../dialog/interpreter.js"),
    FetcherManager = require("./../fetchers/fetchermanager.js"),
    Communicator = require("./../dialog/communicator.js"),
    Sentinel = require("./../bot/sentinel.js"),
    ServerManager = require("./../servers/servermanager.js");

module.exports = class Anubis {
    /**
     * 
     * @param {Object} config 
     */
    constructor(config) {
        this.config = config;
        this.init();
    }

    init() {
        console.info("Anubis - Initializing components...");
        this.bot = new Discord.Client();
        this.sentinel = new Sentinel(this);
        this.interpreter = new Interpreter(this);
        this.fetcherManager = new FetcherManager(this);
        this.communicator = new Communicator(this);
        this.mSmanager = new ServerManager(this);
    }

    //region GETTER

    /**
     * @return {ServerManager}
     */
    get smanager() {
        return this.mSmanager;
    }

    //endregion

    prepare() {
        console.info("Anubis - Preparing components...");
        this.fetcherManager.prepare();
        this.interpreter.prepare();
        this.communicator.prepare();
        this.sentinel.prepare();
    }
    
    ready() {
        console.info("Anubis - Readying components...");
        this.interpreter.ready();
        this.fetcherManager.ready();
        this.communicator.ready();
        this.sentinel.ready();
    }
    
    run() {
        console.info("Anubis - Running components...");
        this.interpreter.run();
        this.fetcherManager.run();
        this.communicator.run();
        this.sentinel.run();
    }

    connect() {
        console.log('Anubis - Connecting to "Discord" server...');
        let env = process.env.NODE_ENV == undefined ? "development" : process.env.NODE_ENV;
		this.bot.login(this.config.discord[env].token);
    }

    disconnect() {}

    destroy() {
        console.info("Anubis - Destroying components...");
        delete this.mSmanager;
        delete this.sentinel;
        delete this.interpreter;
        delete this.fetcherManager;
        delete this.communicator;
        this.bot.destroy();
        delete this.bot;
    }

    reboot() {
        console.info("Anubis - Rebooting...");
        this.destroy();
        this.init();
        this.prepare();
        this.ready();
        this.connect();
        console.info("Anubis - Reboot complete.");
    }
}