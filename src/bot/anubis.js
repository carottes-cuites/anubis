"use strict";

var Discord = require("discord.js");
const Interpreter = require("./../dialog/interpreter.js");
var FetcherManager = require("./../fetchers/fetchermanager.js");
var Communicator = require("./../dialog/communicator.js");
var Sentinel = require("./../bot/sentinel.js");
var ServerManager = require("./../servers/servermanager.js");

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
        this.fetcherManager.prepare();
        this.interpreter.prepare();
        this.communicator.prepare();
        this.sentinel.prepare();
    }
    
    ready() {
        this.interpreter.ready();
        this.fetcherManager.ready();
        this.communicator.ready();
        this.sentinel.ready();
    }
    
    run() {
        this.interpreter.run();
        this.fetcherManager.run();
        this.communicator.run();
        this.sentinel.run();
    }

    connect() {
        console.log('Trying to communicate with "Discord" server...');
        let env = process.env.NODE_ENV == undefined ? "development" : process.env.NODE_ENV;
		this.bot.login(this.config.discord[env].token);
    }

    disconnect() {}
}