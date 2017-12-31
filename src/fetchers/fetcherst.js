"use strict";

var Fetcher = require('./../fetchers/fetcher.js');
module.exports = class FetcherST extends Fetcher {
    constructor(anubis) {
        super('spotify', anubis);
    }

    init() {
        super.init();
        this.uri = "https://api.spotify.com/v1/";
    }

    prepare (){
        this.addCommand('STREAM', this.stream);
    }

    spotifyFormat(msg) {
        return msg.replace(" ", "+");
    }

    stream(that, data, message) {
        data.request = that.spotifyFormat(data.request);
        var options = that.formatRequest(
            {
                q: data.request,
                type: 'track'
            },
            {
                //"Accept": "application/json",
                "Authorization": "Bearer " + that.anubis.config.spotify.token,
            },
            that.uri + 'search'
        );
        console.log(options);
        that.doRequest(
            options,
            (response) => {
                console.log(response);
            }
        )
    }

    refreshAccessToken() {
        //do magic here
    }
}