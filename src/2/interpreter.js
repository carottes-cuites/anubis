var Essential = require("./essential.js");
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
                        if (data.name == undefined && content.indexOf(keyword) != -1) {
                            data.name = serv.name;
                            data.keyword = keyword;
                        }
                    }
                );
            }
        }
        data.obj = this.anubis.fetcherManager.service(data.name.toLowerCase());
        return data;
    }

    extractCommand(edata) {
        var content = edata.request;
        //do more magic here
        var data = {};
        var def;
        for (var serv in DataService.data) {
            serv = DataService.data[serv];
            if(serv.name.toLowerCase() != edata.service.name.toLowerCase()) break;
            for(var cmd in serv.cmds) {
                if(data.method != undefined) break;
                cmd = serv.cmds[cmd];
                cmd.pattern.forEach(
                    (pattern) => {
                        if (pattern == "default") {
                            def = cmd;
                            return;
                        } else if (content.indexOf(pattern) != -1) {
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
        content = content.replace(data.command.pattern, '');
        content = content.replace(data.service.keyword, '');
        return content;
    }

    extractParams(content) {
        return [];
    }

    dump(message) {
        return message.content.split('> ')[1];
    }
}