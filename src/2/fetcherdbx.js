var Fetcher = require('./fetcher.js');

module.exports = class FetcherDBX extends Fetcher {
    constructor(anubis) {
        super('dropbox', anubis);
    }
}