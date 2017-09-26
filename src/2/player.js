module.exports = class Player {
    constructor(server) {
        this.server = server;
        this.init();
    }

    init() {
        this.queue = new Array();
        this.status = "idle";
        this.queueIndex = -1;
        this.dispatcher = undefined;
        this.connection = undefined;
        this.remote_message = '';
    }

    get currentTrack() {
        return this.queue[this.queueIndex];
    }

    formatToQueue(title, streamURL, artist) {
        return {
            title: title,
            streamURL: streamURL,
            artist: artist
        }
    }

    add(args) {
        if (Array.isArray(args)) {
            args.forEach(arg => {
                console.log('"' + arg.title + ' - ' + arg.artist + '" added to queue.');
                this.queue.push(arg);
                this.server.communicator.message(
                    this.server.text,
                    '"' + arg.title + ' - ' + arg.artist + '" added to queue.'
                );
            })
        }
    }

    empty() {
        if (this.queue.length > 0) {
            for(var i = this.queue.length; i > 0; i--) {
                this.queue.pop();
            }
            console.log("Queue cleared");
        } else console.log("Nothing to clear, queue is already empty");
        this.queueIndex = -1;
        this.server.communicator.message(
            this.server.text,
            'No more track to play.'
        );
    }

    play() {
        if(this.queue.length > 0) {
            if(this.status == 'playing') return;
            if(this.queueIndex == -1) this.next();
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
                /*dispatcher.on('speaking', () => {
                    console.log("Streaming...");
                });
                dispatcher.on('start', () => {
                    console.log("Stream starts...");
                    this.status = "playing";
                    this.nils.communicator.sendMessage(
                        'Now playing "' + track.title + ' - ' + track.artist + '".',
                        channels.text
                    );
                });
                dispatcher.on('error', (err) => {
                    console.error(err);
                    fail();
                });*/
            }).catch(err => {
                console.error(err);
                fail();
            });
        });
    }

    next() {
        this.queueIndex++;
        if(this.queueIndex >= this.queue.length) {
            console.log("Nothing more to play");
            this.empty();
            return false;
        }
        return true;
    }

    previous() {
        this.queueIndex--;
        if(this.queueIndex < 0) this.queueIndex = 0;
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
                    if(this.queueIndex < this.queue.length - 1) {
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