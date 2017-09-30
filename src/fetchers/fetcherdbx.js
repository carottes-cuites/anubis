"use strict";

var Fetcher = require('./../fetchers/fetcher.js');

module.exports = class FetcherDBX extends Fetcher {
    constructor(anubis) {
        super('dropbox', anubis);
    }
}