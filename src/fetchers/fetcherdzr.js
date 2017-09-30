"use strict";

var Fetcher = require('./../fetchers/fetcher.js');
module.exports = class FetcherDZR extends Fetcher {
    constructor(anubis) {
        super('deezer', anubis);
    }

    init() {
        super.init();
        this.uri = "http://api.deezer.com/";
    }

    prepare() {
        this.addCommand('STREAM', this.stream);
        this.addCommand('PLAY_ARTIST', this.artist);
        this.addCommand('PLAY_RADIO', this.radio);
    }

    deezerFormat(msg) {
        return msg.replace(" ", "+");
    }

    stream(that, data, message) {
        data.request = that.deezerFormat(data.request);
        var options = that.formatRequest(
            {
                q: data.request,
                limit: 5
            },
            undefined,
            that.uri + "search/"
        );
        var player = that.anubis.smanager.getServer(data.serverID).player;
        that.doRequest(options, (response) => {
            var res = response.data;
            var added = false;
            for (var i = 1; i < res.length; i++) {
                if (res[i].preview != undefined && res[i].preview != null) {
                    res = res[i];
                    added = true;
                }
            }
            if (added) {
                player.add(
                        [player.formatToQueue(
                            res.title,
                            res.preview,
                            res.artist.name
                        )]
                    );
                player.play();
            } else {
                // message " no track playable "
            }
        });
    }

    artist(that, data, message) {
        that.fetchArtist(that, data, message)
        .then(
            artist => {
                data.request = that.deezerFormat(data.request);
                var options = that.formatRequest(
                    {
                        limit: that.itemsLimit
                    },
                    undefined,
                    that.uri + "artist/" + artist.data.id + "/top"
                );
                var player = that.anubis.smanager.getServer(data.serverID).player;
                that.doRequest(options, (response) => {
                    var added = false;
                    var res = response.data;
                    var queue = [];
                    res.forEach(
                        item => {
                            if(item.preview != undefined && item.preview != null) {
                                queue.push(
                                    player.formatToQueue(
                                        item.title,
                                        item.preview,
                                        item.artist.name
                                    )
                                );
                                added = true;
                            }
                        }
                    );
                    if (added) {
                        player.add(queue);
                        player.play();
                    } else {
                        // message " no track playable "
                    }
                });
        });
    }

    fetchArtist(that, data, message) {
        return new Promise(
            (resolve, reject) => {
                var result = {
                    status: 'fail'
                }
                var success = () => resolve(result);
                var fail = () => reject(result);
                data.request = that.deezerFormat(data.request);
                var options = that.formatRequest(
                    {
                        q: data.request,
                        limit: 5
                    },
                    undefined,
                    that.uri + "search/artist/"
                );
                that.doRequest(
                    options,
                    (response) => {
                        var artists = response.data;
                        var artist = undefined;
                        if (artists.length == undefined) {
                            fail();
                            return;
                        }
                        for (var i = 0; i < artists.length; i++) {
                            if (artists[i].name.toLowerCase().indexOf(data.request)) {
                                result.data = artists[i];
                                artist = artists[i];
                                break;
                            }
                        }
                        if (artist != undefined) success();
                        else fail();
                    }
                );
            }
        );
    }

    //region Radio

    radio(that, data, message) {
        that.fetchRadio(that, data, message)
        .then(
            radio => {
                var options = that.formatRequest(
                    {
                        limit: that.itemsLimit
                    },
                    undefined,
                    that.uri + "radio/" + radio.data.id + "/tracks"
                );
                var player = that.anubis.smanager.getServer(data.serverID).player;
                that.doRequest(options, (response) => {
                    var added = false;
                    var res = response.data;
                    var queue = [];
                    res.forEach(
                        item => {
                            if(item.preview != undefined && item.preview != null) {
                                queue.push(
                                    player.formatToQueue(
                                        item.title,
                                        item.preview,
                                        item.artist.name
                                    )
                                );
                                added = true;
                            }
                        }
                    );
                    if (added) {
                        player.add(queue);
                        player.play();
                    } else {
                        // message " no track playable "
                    }
                });
            }
        )
        .catch(console.error);
    }

    fetchRadio(that, data, message) {
        return new Promise(
            (resolve, reject) => {
                var result = {
                    status: 'fail'
                }
                var success = () => resolve(result);
                var fail = () => reject(result);
                data.request = that.deezerFormat(data.request);
                var options = that.formatRequest(
                    {
                        q: data.request,
                        limit: 5
                    },
                    undefined,
                    that.uri + "search/radio/"
                );
                that.doRequest(
                    options,
                    (response) => {
                        var radios = response.data;
                        var radio = undefined;
                        if (radios.length == undefined) {
                            fail();
                            return;
                        }
                        for (var i = 0; i < radios.length; i++) {
                            if (radios[i].title.toLowerCase().indexOf(data.request)) {
                                result.data = radios[i];
                                radio = radios[i];
                                break;
                            }
                        }
                        if (radio != undefined) success();
                        else fail();
                    }
                );
            }
        );
    }
    //endregion
}