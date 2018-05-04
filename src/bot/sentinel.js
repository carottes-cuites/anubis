"use strict";

let Essential = require("./../common/essential.js");

module.exports = class Sentinel extends Essential {
    constructor(anubis) {
        super(anubis);
    }

    init(){
        super.init();
        this.queueMessages = [];
        this.processing = false;
        this.dumbMessage = "Stop calling me %s if you don't know how to make properly a request!";
    } 
    
    ready() {
        this.setEvents();
    }

    setEvents() {
        console.log("Sentinel - Setting listeners up...")
		this.anubis.bot.on('message', (msg) => {this.onMessage(msg);});
		this.anubis.bot.on('ready', () => {this.onReady();});
    }

    onReady() {
        console.log("Sentinel - Ready to communicate...");
        if(process.env.NODE_ENV == "development") this.anubis.communicator.broadcast("I am back on track folks!");
    }

    onMessage(message) {
        if (!this.validate(message)) return;
        this.addMessageToQueue(message);
        if (!this.processing) this.processMessage(message);
    }

    addMessageToQueue(message) {
        this.queueMessages.push(message);
    }

    processMessage(message) {
        let data = {
            request: message.content
        };
        console.log('Sentinel - Message received "' + message.content + '"');
        data.serverID = this.anubis.interpreter.detectServer(message);
        try {
            this.processing = true;
            if (data.serverID == undefined) {
                console.error("Sentinel - Server detection failed. Please proceed to a maintenance of the system.");
                return;
            }
            data.service = this.anubis.interpreter.detectService(message);
            if (data.service.obj == undefined) {
                let native = this.anubis.interpreter.detectNativeCommand(message);
                if(native.command == undefined) {
                    console.error("Sentinel - No service nor native method found");
                    this.anubis.communicator.message(
                        this.anubis.smanager.getServer(data.serverID).text,
                        this.format(this.dumbMessage, [message.author])
                    );
                    throw new Error("No service nor native method found");
                } else {
                    console.log("Sentinel - Native command found");
                    data.service = native.service;
                    data.command = native.command
                    data.request = this.anubis.interpreter.extractNativeCommand(data);
                }
            } else {
                data.command = this.anubis.interpreter.extractCommand(data);
                if (data.command == undefined) {
                    console.error('Sentinel - Command "' + data.command.method + '" not found / registered for the service "' + service.name + '"');
                    this.anubis.communicator.message(
                        this.anubis.smanager.getServer(data.serverID).text,
                        this.format(this.dumbMessage, [message.author])
                    );
                    throw new Error('Command "' + data.command.method + '" not found / registered for the service "' + service.name + '"');
                }
                data.request = this.anubis.interpreter.extractRequest(data);
            }
            data.service.obj.execute(data, message).then(
                (resolve) => {
                    this.processing = false;
                    this.messageProcessed();
                }
            ).catch((rej) => {
                throw new Error(rej);
            });
        } catch(error) {
            console.error("Sentinel - Wrong request content : " + data.request);
            this.anubis.communicator.message(
                this.anubis.smanager.getServer(data.serverID).text,
                "Oups, something went wrong with the request \"" + data.request.split(">")[1] + "\"."
            );
            this.processing = false;
            this.messageProcessed();
        }
    }

    messageProcessed() {
        if (this.queueMessages.length > 0) this.queueMessages.shift();
        if (this.queueMessages.length > 0) this.processMessage(this.queueMessages[0]);
    }

    validate(message) {
        return message.content.includes(this.anubis.bot.user.id);
    }
}