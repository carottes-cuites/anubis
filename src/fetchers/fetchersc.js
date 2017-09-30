"use strict";

var Fetcher = require('./../fetchers/fetcher.js');
module.exports = class FetcherSC extends Fetcher {
    constructor(anubis) {
        super('soundcloud', anubis);
    }
}