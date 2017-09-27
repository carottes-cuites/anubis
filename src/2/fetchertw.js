"use strict";

var Fetcher = require('./fetcher.js');
var Twitch = require('twitch-get-stream');
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
        Twitch = Twitch(this.anubis.config.twitch.client);
        this.addCommand('STREAM', this.twitch);
    }
    
    twitch(that, data, message) {
        var channel = data.request.replace(' ', '');
        that.getChannels(that, channel)
        .then(response => {
            channel = response.data;
            that.getAudio(channel.name)
                .then(response => {
                    var player = that.anubis.smanager.getServer(data.serverID).player;
                    player.add(
                        [player.formatToQueue(
                            'Twitch',
                            response.url,
                            'Streamer ' + channel.name
                        )]
                    );
                    player.play();
                })
                .catch(err => {
                    console.error(err);
                    var server = that.anubis.smanager.getServer(data.serverID);
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
                Twitch.get(channel).then(function(streams) {
                    streams.forEach(stream => {
                        if (stream.quality.indexOf('Audio') != -1) url = stream.url;
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
                    console.log("dah");
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