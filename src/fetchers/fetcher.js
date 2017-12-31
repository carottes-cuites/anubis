"use strict";

const Essential = require("./../common/essential.js");
const Request = require("request-promise");

module.exports = class Fetcher extends Essential{
    constructor(name, anubis) {
        super(anubis);
        this.name = name;
    }

    init() {
        super.init();
        this.commands = {};
        this.itemsLimit = 15;
    }

    addCommand(id, method) {
        this.commands[id] = method;
    }

    execute(data, message) {
        if (data == undefined) return;
        this.command(data.command.method)(this, data, message);
    }

    command(id) {
        return this.commands[id];
    }

    formatRequest(qs, headers, uri) {
        var options = {
            uri: this.uri,
            qs: {},
            headers: {},
            json: true
        };
        options.headers['User-Agent'] = 'Request-Promise';
        if (uri != undefined) options.uri = uri;
        if (qs != undefined) {
            for(var q in qs) {
                options.qs[q] = qs[q];
            }
        }
        if (headers != undefined) {
            for(var header in headers) {
                options.headers[header] = headers[header];
            }
        }
        return options;
    }

    doRequest(options, callback) {
        Request(options)
            .then(callback)
            .catch(
                function(err) {
                    console.error(err);
                }
            );
    }
}