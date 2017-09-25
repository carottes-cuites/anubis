var Fetcher = require('./fetcher.js');
var Twitch = require('twitch-get-stream');
module.exports = class FetcherTW extends Fetcher {
    constructor(anubis) {
        super('twitch', anubis);
    }

    prepare() {
        Twitch = Twitch(this.anubis.config.twitch.client);
        this.addCommand('STREAM', this.twitch);
    }
    
    twitch(that, data, message) {
        var channel = data.request.replace(' ', '');
        that.getAudio(channel)
            .then(response => {
                var player = that.anubis.smanager.getServer(data.serverID).player;
                player.add(
                    [player.formatToQueue(
                        'Twitch',
                        response.url,
                        'Streamer ' + channel
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
                            '"' + channel + '" not found / alive at the moment'
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
        return;
        var url;
        Twitch.get('timthetatman')
            .then(function(streams) {
                streams.forEach(
                    stream => {
                        if(stream.quality.indexOf('Audio')) {
                            console.log(stream);
                            url = stream.url;
                        }
                    }
                );
                var player = that.anubis.smanager.getServer(data.serverID).player;
                player.add(
                    [player.formatToQueue(
                        'Twitch',
                        url,
                        'Streamer'
                    )]
                );
                player.play();
            })
        
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
                        if (stream.quality.indexOf('Audio')) {
                            console.log(stream.url);
                            url = stream.url;
                        }
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
}