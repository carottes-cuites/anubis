"use strict";

const ytdl = require('ytdl-core');
const google = require("googleapis");
const youtube = google.google.youtube('v3');
const Fetcher = require('./../fetchers/fetcher.js');
const Anubis = require('./../bot/anubis.js');
let Track = require('./../player/track.js');

module.exports = class FetcherYT extends Fetcher {
    /**
     * 
     * @param {Anubis} anubis 
     */
    constructor(anubis) {
        super("Youtube", anubis);
    }

    init() {
        super.init();
        this.uri = "https://www.youtube.com/watch?v=";
    }

    prepare() {
        this.addCommand('STREAM', this.stream);
        this.addCommand('PLAY_PLAYLIST', this.playlist);
    }

    playlist(that, data, message) {
        console.log("Requested " + data.request);
        let server = that.anubis.smanager.getServer(data.serverID);
        server.communicator.message(
            server.text,
            'Fetching playlist\'s "' + data.request + '" data...' 
        );
        youtube.playlistItems.list(
            {
                key: that.anubis.config.youtube.api_key,
                part: 'id,snippet',
                playlistId: data.request,
                maxResult: 100,
            },
            (err, results) => {
                that.fetchVideo(results, that, data.serverID, 0).then(
                    (resolve) => {
                        that.anubis.smanager.getServer(data.serverID).player.play();
                        that.fetchPlaylist(that, data, results);
                    }
                );
            }
        );
    }

    fetchData(data) {
        return new Promise((res, rej) => {
            try {
                let stream;
                ytdl(data.url, data.options).pipe(stream);
                res(stream);
            } catch(error) {
                rej(error);
            }
        });
    }

    fetchVideo(results, that, serverID, index) {
        return new Promise(
            (resolve, reject) => {
                let player = that.anubis.smanager.getServer(serverID).player;
                let video = results.data.items[index].snippet;
                let url = that.uri + video.resourceId.videoId;
                ytdl.getInfo(url, (err, info) => {
                    player.add(
                        [player.formatToQueue(
                            info.title,
                            undefined,
                            "",
                            that.fetchData,
                            {
                                url: url,
                                options: { filter : 'audioonly' }
                            }
                        )]
                    );
                    resolve();
                });
            }
        );
    }

    fetchPlaylist(that, data, results) {
        let videos = results.data.items.length;
        let player = that.anubis.smanager.getServer(data.serverID).player;
        let fetchThat = (index) => {
            return new Promise((resolve, reject) => {
                that.fetchVideo(results, that, data.serverID, index).then(
                    (res) => {
                        index++;
                        if (index == videos) resolve();
                        else resolve(fetchThat(index));
                    }
                );
            });
        };
        fetchThat(1).then((r) => {
            if (results.data.nextPageToken != undefined) {
                youtube.playlistItems.list(
                    {
                        key: that.anubis.config.youtube.api_key,
                        pageToken: results.data.nextPageToken,
                        part: 'id,snippet',
                        playlistId: data.request,
                        maxResult: 100,
                    },
                    (err, response) => {
                        that.fetchPlaylist(that, data, response);
                    }
                );
            }
        });
    }

    /**
     * 
     * @param {FetcherYT} that 
     * @param {*} data 
     * @param {*} message 
     */
    stream(that, data, message) {
        var url = that.uri + data.request;
        console.log("STREAM YOUTUBE");
        try {
            ytdl.getInfo(url, (err, info) => {
                let stream = ytdl(
                    url,
                    {
                        quality: 'highestaudio',
                        filter : 'audioonly'
                    }
                );
                let player = that.anubis.smanager.getServer(data.serverID).player;
                //region PLAYER REWORKED
                let time = parseInt(info.length_seconds);
                time = Math.floor(time / 3600) + "h" + Math.floor(time / 60) + "m" + (time % 60) + "s"
                console.log(time);
                let track = new Track(
                    info.title,
                    "",
                    stream,
                    time
                );
                player.feed(track);
                //endregion
            })
        } catch(error) {
            console.log(error);
            // message " no track playable "
        }
    }
}