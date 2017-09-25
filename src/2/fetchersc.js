var Fetcher = require('./fetcher.js');
module.exports = class FetcherSC extends Fetcher {
    constructor(anubis) {
        super('soundcloud', anubis);
    }
}