"use strict";

var Fetcher = require('./fetcher.js');
module.exports = class FetcherST extends Fetcher {
    constructor(anubis) {
        super('spotify', anubis);
    }
}