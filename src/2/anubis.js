var Discord = require("discord.js");
const Interpreter = require("./interpreter.js");
var FetcherManager = require("./fetchermanager.js");
var Communicator = require("./communicator.js");
var Sentinel = require("./sentinel.js");
var ServerManager = require("./servermanager.js");

module.exports = class Anubis {
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
        this.smanager = new ServerManager(this);
    }

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
		this.bot.login(this.config.discord.token);
    }

    disconnect() {}
}