"use strict";

const ytdl = require('ytdl-core');
const google = require("googleapis");
const youtube = google.google.youtube('v3');
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
                let player = that.anubis.smanager.getServer(data.serverID).player;
                let video = results.data.items[0].snippet;
                let url = that.uri + video.resourceId.videoId;
                ytdl.getInfo(url, (err, info) => {
                    let stream = ytdl(url, { filter : 'audioonly' });
                    player.add(
                        [player.formatToQueue(
                            info.title,
                            stream,
                            ""
                        )]
                    );
                    player.play();
                    that.fetchPlaylist(that, data, results);
                });
            }
        );
    }

    fetchPlaylist(that, data, results) {
        let videos = results.data.items;
        let player = that.anubis.smanager.getServer(data.serverID).player;
        console.log("Feeding queue...");
        for(let i = 1; i < videos.length; i++) {
            let video = videos[i].snippet;
            let url = that.uri + video.resourceId.videoId;
            console.log(url);
            ytdl.getInfo(url, (err, info) => {
                let stream = ytdl(url, { filter : 'audioonly' });
                player.add(
                    [player.formatToQueue(
                        info.title,
                        stream,
                        ""
                    )]
                );
            });
        }
        if (results.data.nextPageToken != undefined) {
            youtube.playlistItems.list(
                {
                    key: that.anubis.config.youtube.api_key,
                    pageToken: results.data.nextPageToken,
                    part: 'id,snippet',
                    playlistId: data.request,
                    maxResult: 100,
                },
                (err, res) => {
                    that.fetchPlaylist(that, data, res);
                }
            );
        }
    }

    stream(that, data, message) {
        var url = that.uri + data.request;
        console.log("STREAM YOUTUBE");
        try {
            ytdl.getInfo(url, (err, info) => {
                let stream = ytdl(url, { filter : 'audioonly' });
                let player = that.anubis.smanager.getServer(data.serverID).player;
                player.add(
                    [player.formatToQueue(
                        info.title,
                        stream,
                        ""
                    )]
                )
                player.play();
            })
        } catch(error) {
            console.log(error);
            // message " no track playable "
        }
        console.log("ENDD");
    }
}