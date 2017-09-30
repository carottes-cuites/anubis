"use strict";

var Essential = require("./../common/essential.js");
var DataService = require('./../../resources/data/config/service.json');
module.exports = class Interpreter extends Essential {
    constructor(anubis) {
        super(anubis);
    } 

    messageReceived() {}

    detectServer(message) {
        //check if server exists here
        var server = this.anubis.smanager.getServer(message.guild.id);
        if(server == undefined) server = this.anubis.smanager.addServer(message.guild);
        return server.guild.id;
    }

    detectService(message) {
        var content = this.dump(message);
        var data = {};
        for(var serv in DataService.data) {
            serv = DataService.data[serv];
            if (data.name == undefined) {
                serv.keywords.forEach(
                    (keyword) => {
                        if (data.name == undefined && content.indexOf(keyword + " ") != -1) {
                            data.name = serv.name;
                            data.keyword = keyword;
                            data.obj = this.anubis.fetcherManager.service(data.name.toLowerCase());
                        }
                    }
                );
            }
        }
        return data;
    }

    detectNativeCommand(message) {
        var content = this.dump(message) + ' ';
        var data = {};
        var native = DataService.data.native;
        for (var cmd in native.cmds) {
            if(data.method != undefined) break;
            cmd = native.cmds[cmd];
            cmd.pattern.forEach(pattern => {
                if (content.indexOf(pattern + ' ') != -1) {
                    data.command = {
                        method: cmd.method,
                        pattern: pattern
                    };
                    data.service = {
                        name: native.name,
                        keyword: '',
                        obj: this.anubis.fetcherManager.service(native.name.toLowerCase())
                    };
                }
            });
        }
        return data;
    }

    extractCommand(edata) {
        var content = edata.request;
        //do more magic here
        var data = {};
        var def;
        for (var serv in DataService.data) {
            serv = DataService.data[serv];
            if(serv.name == 'Native' || serv.name.toLowerCase() != edata.service.name.toLowerCase()) continue;
            for(var cmd in serv.cmds) {
                if(data.method != undefined) break;
                cmd = serv.cmds[cmd];
                cmd.pattern.forEach(
                    (pattern) => {
                        if (pattern == "default") {
                            def = cmd;
                            return;
                        } else if (content.indexOf(pattern + " ") != -1) {
                            data.method = cmd.method;
                            data.pattern = pattern;
                        } 
                    }
                );
            }
        }
        if (data.method == undefined) {
            data.method = def.method;
            data.pattern = '';
        }
        return data;
    }

    extractRequest(data) {
        var content = data.request.split('> ')[1];
        content = content.replace(data.service.keyword + ' ', '');
        if(data.command.pattern !== '') content = content.replace(data.command.pattern + ' ', '');
        return content;
    }

    extractNativeCommand(data) {
        return data.request.split('> ')[1];
    }

    extractParams(content) {
        return [];
    }

    dump(message) {
        return message.content.split('> ')[1];
    }
}