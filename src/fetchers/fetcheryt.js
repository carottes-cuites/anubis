"use strict";

const ytdl = require('ytdl-core');
const Fetcher = require('./../fetchers/fetcher.js');

module.exports = class FetcherYT extends Fetcher {
    constructor(anubis) {
        super("Youtube", anubis);
    }

    init() {
        super.init();
        this.uri = "https://www.youtube.com/watch?v=";
    }

    prepare() {
        this.addCommand('STREAM', this.stream);
    }

    stream(that, data, message) {
        var url = that.uri + data.request;
        console.log("STREAM YOUTUBE");
        try {
            ytdl.getInfo(url, (err, info) => {
                let stream = ytdl(url, { filter : 'audioonly' });
                that.anubis.smanager.getServer(data.serverID).player.streamFlux(info, stream);
            })
        } catch(error) {
            console.log(error);
            // message " no track playable "
        }
        console.log("ENDD");
    }
}