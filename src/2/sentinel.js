"use strict";

var Essential = require("./essential.js");

module.exports = class Sentinel extends Essential {
    constructor(anubis) {
        super(anubis);
    }

    init(){
        super.init();
        this.dumbMessage = "Stop calling me %s if you don't know how to make properly a request!";
    } 
    
    ready() {
        this.setEvents();
    }

    setEvents() {
        console.log("Sentinel listens...")
		this.anubis.bot.on('message', (msg) => {this.onMessage(msg);});
		this.anubis.bot.on('ready', () => {this.onReady();});
    }

    onReady() {
        console.log("Bot is ready to communicate");
        this.anubis.communicator.broadcast("I am back on track folks!");
    }

    onMessage(message) {
        if (!this.validate(message)) return;
        var data = {
            request: message.content
        };
        console.log('Message received "' + message.content + '"');
        data.serverID = this.anubis.interpreter.detectServer(message);
        if (data.serverID == undefined) {
            console.error("Server detection failed. Please proceed to a maintenance of the system.");
            return;
        }
        data.service = this.anubis.interpreter.detectService(message);
        if (data.service.obj == undefined) {
            var native = this.anubis.interpreter.detectNativeCommand(message);
            if(native.command == undefined) {
                console.error("No service nor native method found");
                this.anubis.communicator.broadcast(
                    this.format(this.dumbMessage, [message.author])
                );
                return;
            } else {
                console.log("Native command found");
                data.service = native.service;
                data.command = native.command
                data.request = this.anubis.interpreter.extractNativeCommand(data);
            }
        } else {
            data.command = this.anubis.interpreter.extractCommand(data);
            if (data.command == undefined) {
                console.error('Command "' + data.command.method + '" not found / registered for the service "' + service.name + '"');
                this.anubis.communicator.broadcast(
                    this.format(this.dumbMessage, [message.author])
                );
                return;
            }
            data.request = this.anubis.interpreter.extractRequest(data);
        }
        data.service.obj.execute(data, message);
    }

    validate(message) {
        return message.content.includes(this.anubis.bot.user.id);
    }
}