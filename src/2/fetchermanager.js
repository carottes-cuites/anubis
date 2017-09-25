var Essential = require("./essential.js");
var FetcherDBX = require("./fetcherdbx.js");
var FetcherDZR = require("./fetcherdzr.js");
var FetcherSC = require("./fetchersc.js");
var FetcherST = require("./fetcherst.js");

module.exports = class FetcherManager extends Essential {
    constructor(anubis) {
        super(anubis);
    }

    init() {
        super.init();
        this.services = {};
    }

    prepare() {
        this.add('deezer', new FetcherDZR(this.anubis));
        this.add('dropbox', new FetcherDBX(this.anubis));
        this.add('soundcloud', new FetcherSC(this.anubis));
        this.add('spotify', new FetcherST(this.anubis));
        for( var service  in this.services) {
            this.services[service].prepare();
        }
    }

    add(id, service) {
        this.services[id] = service;
    }

    service(id) {
        return this.services[id];
    }
}