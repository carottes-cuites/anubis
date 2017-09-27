"use strict";

const Essential = require("./essential.js");
const FetcherDBX = require("./fetcherdbx.js");
const FetcherDZR = require("./fetcherdzr.js");
const FetcherSC = require("./fetchersc.js");
const FetcherST = require("./fetcherst.js");
const FetcherTW = require("./fetchertw.js");
const Native = require("./native.js");

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
        this.add('twitch', new FetcherTW(this.anubis));
        this.add('native', new Native(this.anubis));
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