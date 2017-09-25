const Streamer = require("./streamer.js");
const Request = require("request");

module.exports = class StreamerDeezer extends Streamer {
	constructor(nils) {
		super(nils);
	}

	init() {
		super.init();
		this.radios = {};
	}

	prepare() {
		
	}

	// region Title

	requestPreview(query, callback) {
		var that = this;
		Request(
			'http://api.deezer.com/search/?q=' + query.title,
			function(error, resp, body) {
				if (!error && resp.statusCode == 200) {
					if(typeof callback === "function") {
						callback(JSON.parse(body).data, that, query);
					}
				} else {
					that.nils.communicator.sendMessage(
						'Sorry but "Deezer" service is not available right now. Please try later.',
						query.channel
					);
				}
			}
		);
	}

	getPreviewLink(data, that, query) {
		var cmds = that.applyCommand(data, query.cmds);
		var track = data[typeof cmds.alt !== 'undefined' ? cmds.alt : 0];
		/*that.nils.communicator.sendMessage(
			'Now playing "' + track.title + ' - ' + track.artist.name + '".',
			query.channel
		);*/
		var server = that.nils.streamer.getServer(query.serverID);
		server.addToQueue([
			server.formatToQueue(track.title, track.preview, track.artist.name)
		]);
		server.play({
			stream: that.voiceChannel(),
			text: query.channel
		});
		//that.streamAudio(track.preview);
	}

	//endregion

	//region RADIO

	requestRadios() {
		if(this.radios == undefined) {
			//request radios here
			//then
		} else {
			//then
		}
	}

	requestRadioTrackList(radioID) {
		//getRadio TrackList
	}

	//endregion

	applyCommand(data, cmds) {
		var results = {};
		cmds.forEach(cmd => {
			switch(cmd) {
				case 'alt':
					results.alt = parseInt(Math.random() * data.length);
				break;
				default:
					console.log('Command unknown "/' + cmd + '".');
				break;
			}
		});
		return results;
	}

	stream(message) {
		var query = {};
		var request = message.content;
		//CMDS
		query.cmds = message.content.split("/");
		if(query.cmds.length > 0) request = query.cmds[0].split("dzr ")[1];
		query.cmds.shift();
		for(var i= 0; i < query.cmds.length; i++) {
			query.cmds[i] = query.cmds[i].replace(/\s/g, '');
		}
		//CHANNEL
		query.channel = message.channel;
		//SERVER
		query.serverID = message.guild.id;
		//QUERY
		switch(this.identifyQuery(request)) {
			case "radio":
				query.genre = request.split("radio:")[1];
				this.requestPreview(query, this.getPreviewLink);
			break;
			default:
				query.title = message.content.split("dzr ")[1];
				if (query.title.indexOf("/alt") != -1) query.title = query.title.split("/")[0];
				this.requestPreview(query, this.getPreviewLink);
			break;
		}
	}

	identifyQuery(content) {
		var type = "title";
		if(content.indexOf('radio:') != -1) type = "radio";
		return type;
	}
}