"use strict";

module.exports = class Player {
    constructor(server) {
        this.server = server;
        this.init();
    }

    init() {
        this.queue = new Array();
        this.status = "idle";
        this.dispatcher = undefined;
        this.connection = undefined;
        this.remote_message = '';
    }

    get currentTrack() {
        return this.queue[0];
    }

    get nextTrack() {
        return this.queue[1];
    }
    
    formatToQueue(title, streamURL, artist, fetcher, data) {
        return {
            title: title,
            streamURL: streamURL,
            artist: artist,
            fetcher: fetcher,
            data: data
        }
    }

    add(args) {
        if (Array.isArray(args)) {
            let msg = 'Feeding queue with :';
            args.forEach(arg => {
                this.queue.push(arg);
                msg += '\n* ' + arg.title + (arg.artist == "" ? '' : ' - ' + arg.artist);
            })
            this.server.communicator.message(this.server.text, msg);
            console.log(msg);
        }
    }

    empty() {
        if (this.queue.length > 0) {
            for(var i = this.queue.length; i > 0; i--) {
                this.queue.pop();
            }
            console.log("Queue cleared");
        } else console.log("Nothing to clear, queue is already empty");
        this.server.communicator.message(
            this.server.text,
            'No more track to play.'
        );
    }

    play() {
        if(this.queue.length > 0) {
            if(this.status == 'playing') return;
            this.stream().then(() => {
                this.connection = undefined;
                this.dispatcher = undefined;
                switch(this.remote_message) {
                    case 'stop':
                        this.empty();
                    break;
                    default:
                        if(this.next()) {
                            this.play();
                        }
                    break;
                }
                this.remote_message = '';
            }).catch((err) => {
                console.error(err);
                this.connection = undefined;
                this.dispatcher = undefined;
            });
        }
    }

    // TODO
    preload() {
        if(this.nextTrack != undefined) {
            console.log("PRELOADING data");
            this.nextTrack.fetcher(
                this.currentTrack.data
            ).then(
                (res) => {
                    this.nextTrack.streamURL = res;
                }
            );
        }
    }

    stream() {
        var track = this.currentTrack;
        return new Promise((resolve, reject) => {
            var success = () => resolve({
                data: 'success'
            });
            var fail = () => reject({
                data: 'fail'
            });
            var chan = this.server.voice;
            if (chan == undefined) return;
            if (track.streamURL == undefined) {
                track.fetcher(track.data).then((res) => {
                    chan.join().then(connection => {
                        this.connection = connection;
                        return connection.playStream(res);
                    }).then(dispatcher => {
                        this.dispatcher = dispatcher;
                        dispatcher.setBitrate("auto");
                        dispatcher.on('start', () => {
                            console.log("Stream starts...");
                            this.server.communicator.message(
                                this.server.text,
                                'Now playing "' + track.title + ' - ' + track.artist + '"'
                            );
                            this.status = "playing";
                        });
                        dispatcher.on('end', () => {
                            console.log("Stream end.");
                            this.status = "idle";
                            //dispatcher.end();
                            success();
                            return true;
                        });
                    }).catch(err => {
                        console.error(err);
                    });
                }).catch((rej) => {
                    console.error(err);
                    fail();
                });
            } else {
                chan.join().then(connection => {
                    this.connection = connection;
                    return connection.playStream(track.streamURL);
                }).then(dispatcher => {
                    this.dispatcher = dispatcher;
                    dispatcher.on('start', () => {
                        console.log("Stream starts...");
                        this.server.communicator.message(
                            this.server.text,
                            'Now playing "' + track.title + ' - ' + track.artist + '"'
                        );
                        this.status = "playing";
                    });
                    dispatcher.on('end', () => {
                        console.log("Stream end.");
                        this.status = "idle";
                        //dispatcher.end();
                        success();
                        return true;
                    });
                }).catch(err => {
                    console.error(err);
                });
            }
        });
    }

    /**
     * When track is read or skipped.
     */
    trackRead() {
        if (this.queue.length > 0) {
            console.log("TRACK READ");
            this.queue.shift();
        }
    }

    next() {
        this.trackRead();
        if(this.queue.length == 0) {
            console.log("Nothing more to play");
            this.empty();
            return false;
        }
        return true;
    }

    remote(method) {
        this.remote_message = method;
        switch(this.remote_message) {
            case 'play':
                if (this.connection != undefined && !this.connection.paused) {
                    this.dispatcher.resume();
                    this.server.communicator.message(
                        this.server.text,
                        "Stream is resumed."
                    );
                } else {
                    this.play();
                }
            break;
            case 'pause':
                if (this.connection != undefined && !this.connection.paused) {
                    this.dispatcher.pause();
                    this.server.communicator.message(
                        this.server.text,
                        "Stream is paused."
                    );
                }
            break;
            case 'next':
                if (this.dispatcher != undefined) {
                    if(this.queue.length > 1) {
                        this.server.communicator.message(
                            this.server.text,
                            'Skipping track...'
                        );
                        this.dispatcher.end();
                        this.dispatcher = undefined;
                    } else {
                        this.server.communicator.message(
                            this.server.text,
                            'It\'s already the last track of the queue. "Stop" if you are pissed off.'
                        );
                    }
                }
            break;
            case 'stop':
                if (this.dispatcher != undefined) {
                    this.dispatcher.end();
                    this.connection.disconnect();
                    this.dispatcher = undefined;
                    this.server.communicator.message(
                        this.server.text,
                        "Stream is stopped."
                    );
                }
            break;
        }
    }
}