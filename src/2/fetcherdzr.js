"use strict";

var Fetcher = require('./fetcher.js');
module.exports = class FetcherDZR extends Fetcher {
    constructor(anubis) {
        super('deezer', anubis);
    }

    init() {
        super.init();
        this.uri = 'http://api.deezer.com/search/';
    }

    prepare() {
        this.addCommand('STREAM', this.stream);
        this.addCommand('PLAY_ARTIST', ()=>{});
        this.addCommand('PLAY_RADIO', ()=>{});
    }

    stream(that, data, message) {
        data.request = data.request.replace(" ", "+");
        var options = that.formatRequest({
            q: data.request
        });
        var player = that.anubis.smanager.getServer(data.serverID).player;
        that.doRequest(options, (response) => {
            var res = response.data[0];
            player.add(
                [player.formatToQueue(
                    res.title,
                    res.preview,
                    res.artist.name
                )]
            );
            player.play();
        });
    }
}