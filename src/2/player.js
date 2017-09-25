module.exports = class Player {
    constructor(server) {
        this.server = server;
        this.init();
    }

    init() {
        this.queue = new Array();
        this.status = "idle";
        this.queueIndex = -1;
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
                console.log(this.server);
                this.server.communicator.message(
                    this.server.text,
                    '"' + arg.title + ' - ' + arg.artist + '" added to queue.'
                );
            })
        }
    }

    clean() {
        if (this.queue.length > 0) {
            for(var i = this.queue.length; i > 0; i++) {
                this.queue.pop();
            }
        } else console.log("Nothing to clear, queue is already empty");
        this.queueIndex = -1;
    }

    play() {
        if(this.queue.length > 0) {
            if(this.status == 'playing') return;
            if(this.queueIndex == -1) this.next();
            this.stream().then(() => {
                if(this.next()) {
                    this.play();
                }
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
                return connection.playStream(track.streamURL);
            }).then(dispatcher => {
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
                    dispatcher.end();
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
            }).catch(console.error)
        });
    }

    next() {
        this.queueIndex++;
        if(this.queueIndex >= this.queue.length) {
            console.log("Nothing more to play");
            this.clean();
            return false;
        }
        return true;
    }

    previous() {
        this.queueIndex--;
        if(this.queueIndex < 0) this.queueIndex = 0;
    }
}