"use strict";

let Fetcher = require('./../fetchers/fetcher.js'),
    Twitch = require('twitch-get-stream'),
    Track = require('./../player/streamable/track.js');

module.exports = class FetcherTW extends Fetcher {
    constructor(anubis) {
        super('twitch', anubis);
    }

    init() {
        super.init();
        this.uri = 'https://api.twitch.tv/helix/';
        this.deprecated_uri = 'https://api.twitch.tv/kraken/';
    }

    prepare() {
        this.twitch = Twitch(this.anubis.config.twitch.client);
        this.addCommand('STREAM', this.stream);
    }
    
    /**
     * 
     * @param {FetcherTW} that 
     * @param {*} data 
     * @param {*} message 
     */
    stream(that, data, message) {
        let channel = data.request.replace(' ', '');
        that.getChannels(that, channel)
        .then(response => {
            channel = response.data;
            that.getAudio(channel.name)
                .then(response => {
                    let player = that.anubis.smanager.getServer(data.serverID).player;
                    let track = new Track(
                        channel.display_name,
                        channel.game,
                        response.url,
                        0
                    );
                    player.feed(track);
                })
                .catch(err => {
                    console.error(err);
                    let server = that.anubis.smanager.getServer(data.serverID);
                    switch(err.code) {
                        case 404:
                            that.anubis.communicator.message(
                                server.text,
                                '"' + channel.name + '" not found / alive at the moment'
                            );
                        break;
                        default:
                            that.anubis.communicator.message(
                                server.text,
                                'Something went wrong, please try later.'
                            );
                        break;
                    }
                });
            });
    }

    getAudio(channel) {
        return new Promise(
            (resolve, reject) => {
                var url = undefined;
                var results = {
                    status: 'fail'
                };
                var success = () => resolve(results);
                var fail = () => reject(results);
                this.twitch.get(channel).then(function(streams) {
                    streams.forEach(stream => {
                        if (stream.quality.match(/audio/i)) url = stream.url;
                    });
                    if(url != undefined) {
                        results = {
                            status: 'success',
                            url: url
                        };
                        success();
                    } else fail();
                })
                .catch(err => {
                    results.code = err.status;
                    fail();
                });
            }
        )
    }
    
    getUsers(that, request) {
        return new Promise(
            (resolve, reject) => {
                var username = undefined;
                var results = { status: 'fail' };
                var success = () => resolve(results);
                var fail = () => reject(results);
                var options = that.formatRequest(
                    {id:54706574},
                    { "Client-ID": that.anubis.config.twitch.client},
                    that.uri + 'users'
                );
                that.doRequest(options, (response) => {
                    var res = response;
                    console.log(res);
                });
            }
        )
    }

    getStreams(that, request) {
        return new Promise(
            (resolve, reject) => {
                var username = undefined;
                var results = { status: 'fail' };
                var success = () => resolve(results);
                var fail = () => reject(results);
                var options = that.formatRequest(
                    {
                        type:"live"
                    },
                    { "Client-ID": that.anubis.config.twitch.client},
                    that.uri + 'streams'
                );
                that.doRequest(options, (response) => {
                    var res = response;
                    console.log(res);
                });
            }
        )
    }

    getChannels(that,request) {
        return new Promise(
            (resolve, reject) => {
                var results = { status: 'fail' };
                var success = () => resolve(results);
                var fail = () => reject(results);
                var options = that.formatRequest(
                    {
                        query: '' + request
                    },
                    { "Client-ID": that.anubis.config.twitch.client},
                    that.deprecated_uri + 'search/channels'
                );
                that.doRequest(options, (response) => {
                    results.status = 'success';
                    results.data = response.channels[0];
                    success();
                    return fail();
                });
            }
        );
    }
}