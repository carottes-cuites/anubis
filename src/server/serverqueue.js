module.exports = class ServerQueue {

	constructor(id, nils) {
		this.id = id;
		this.nils = nils;
		this.init();
	}

	init() {
		this._queue = new Array();
		this.status = "idle";
		this._currentTrackIndex = 0;
	}

	getCurrentTrack() {
		return this._queue[this._currentTrackIndex];
	}

	get queue() {
		return this._queue;
	}
	
	formatToQueue(title, streamURL, author) {
			return {
				title: title,
				streamURL: streamURL,
				artist: author
			}
	}

	addToQueue(args) {
		if (Array.isArray(args)) {
			args.forEach(arg => {
				this._queue.push(arg);
				console.log(arg.title + " added to queue");
			});
		}
	}

	clearQueue() {
		if (this._queue.length > 0) {
			while(this._queue.length > 0) {
    			this._queue.pop();
			}
		} else {
			console.log("Queue is already empty.");
		}
		this._currentTrackIndex = -1;
	}

	play(channels) {
		if (this._queue.length > 0) {
			if(this.status == "playing") return;
			if(this._currentTrackIndex == -1) this.next();
			this.stream(channels).then(
				() => {
					if (this.next()) {
						this.play(channels);
					}
				}
			)
		}
	}

	stream(channels) {
		var track = this.currentTrack();
		return new Promise(
			(resolve, reject) => {
				var success = () => resolve({data: "success"});
				var fail = () => reject({data: "fail"});
				channels.stream.join().then(connection => {
					return connection.playStream(track.streamURL);
				})
				.then(dispatcher => {
					dispatcher.on('end', () => {
						console.log("Stream end.");
						this.status = "idle";
						success();
						return true;
					});
					dispatcher.on('speaking', () => {
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
					});
				})
				.catch(console.error);
			}
		);
	}

	next() {
		this._currentTrackIndex++;
		if (this._currentTrackIndex >= this._queue.length) {
			console.log("Nothing more to play");
			this.clearQueue();
			return false;
		}
		return true;
	}

	previous() {
		this._currentTrackIndex--;
		if (this._currentTrackIndex < 0) {
			this._currentTrackIndex = 0;
		}
	}

	currentTrack() {
		return this._queue[this._currentTrackIndex];
	}

	currentTrackEnded() {
		this._queue[0] = Object.assign(this._queue[1]);
		this._queue.pop();
	}
}