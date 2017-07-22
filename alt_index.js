const config = require("./config/config.json");
const request = require("request");
const Discord = require("discord.js");
const fs = require("fs");
const Dropbox = require("dropbox");
const bot = new Discord.Client();
const nils = {
	id: 'bot-nils',
	trigger: 'nils',
	name: 'Nils',
	description: 'Music information assistant',
	data:  config.discord,
	metadata: {
		origins: 'https://www.youtube.com/watch?v=OSfxEOK0elM'
	}
};

var _currentName = "";
var _radioContent = [];
var _radioIndex = 0;
var _message = undefined;
var _voiceChannel = undefined;
var dbx = new Dropbox(
	{
		accessToken: config.dropbox.token
	}
);

bot.on('ready', () => {
	debug('Ready...');
	_voiceChannel = bot.channels.filter(g => {
    	return g.type == 'voice' && g.name == 'Music';
	}).first();
	_voiceChannel.join()
		.then(connection => {
			debug('Joined channel Music.');
		})
		.catch(console.error);
});

bot.on('message', msg => {
		if (msg.author.bot) return;
		_message = msg;
		response('Hold on...');
		var message = msg.content.toLowerCase();
		if (message.startsWith(nils.trigger)) {
			debug('Request confirmed :"' + message + '"');
			/*if(containsKeyword(message, "deezer")) {
				msg.member.voiceChannel.join()
					.then(connection => {
						connection.playFile('./resources/son.mp3')
					})
					.catch(console.error);
			} else*/
			if (containsKeyword(message, "stop")) {
					//handle stream controls please here
			} else if (containsKeyword(message, ["hello", "world"])) {
				response("Hi bud' the world awaits us!");
			} else if (containsKeyword(message, "hi")) {
				response("Hi.");
			} else if (containsKeyword(message, "bravo")) {
				response("Here is your poison : " + nils.metadata.origins);
			} else if (containsKeyword(message, ["deezer", "radio"])) {
				var rad = message.split('radio')[1];
				rad = rad.substr(
					rad.indexOf("'") + 1,
					rad.lastIndexOf("'") -2
				);
				streamRadio('http://api.deezer.com/search/radio?q=' + rad, rad);
			} else if (containsKeyword(message, "deezer")) {
				var mes = message.split('deezer ')[1];
				mes = mes.substr(
					mes.indexOf("'") + 1,
					mes.lastIndexOf("'") -1
				);
				streamPreview('http://api.deezer.com/search/?q=' + mes, mes);
			} else if (containsKeyword(message, "dbx")) {

				var cont = {};
				dbx.filesListFolder({path: ''})
					.then(function(response) {
						console.log("list files");
						console.log(response);
						dbx.sharingCreateSharedLink({ path: response.entries[0].path_display})
							.then(function(resp) {
								console.log("generate link");
								console.log(resp.url.split('?')[0])
								dbx.sharingGetSharedLinkFile({ url: resp.url.split('?')[0] })
									.then(function (data) {
										console.log("download file");
										fs.writeFile('./cache/audio/' + data.name, data.fileBinary, 'binary', function (err) {
											if (err) { throw err; }
											console.log('File: ' + data.name + ' saved.');
											streamAudio('./cache/audio/' + data.name);
										});
									})
									.catch(console.error);
							});
					})
					.catch(console.error);
					


			} else {
				response("well... nope. Stop speaking chinese and I may understand what you want one day.");
			}

			// TODO implement dropbox handling in order to party share songs like a radio picking randomly in the Dropbox feed by users

		}
	});

function response(content, del, to) {
	to = to != undefined ? to : "";
	switch (to) {
		case 'author':
		default:
			debug('Reply to "everyone" with "' + content + '".');
			_message.channel.send(content)
				.then(() => debug('Reply sent.'))
				.catch(console.error);
			if (del) {
				_message.delete(1000)
					.then(() => debug('Message deleted.'))
					.catch(console.error);
			}
			break;
	}
}

function streamPreview(url, queryResult) {
	queryDeezer(
		url,
		function(dataFetched) {
			console.log(dataFetched);
			response('You asked for "' + queryResult +"'.");
			var indexData = parseInt(Math.random() * dataFetched.length);
			debug('Preview\'s URL  "' + dataFetched[indexData].preview + '" is gonna be fetched.');
			streamData(dataFetched[indexData].preview, dataFetched[indexData].title);
		}
	);
}

function streamRadio(url, queryResult) {
	console.log("stream radio " + queryResult);
	_currentName = "";
	_radioIndex = 0;
	var qr = queryResult;
	queryDeezer(
		url,
		function (dataFetched) {
			response('You asked for "' + qr +"'.");
			var indexData = parseInt(Math.random() * dataFetched.length);
			queryDeezer(
				'http://api.deezer.com/radio/'+ dataFetched[indexData].id +'/tracks',
				function (df) {
					_radioContent = df;
					nextTrackRadio();
				}
			);
		}
	);
}
function nextTrackRadio() {
	console.log("nextTrackRadio");
	streamData(
		_radioContent[_radioIndex].preview,
		_radioContent[_radioIndex].title,
		function() {
			_radioIndex += 1;
			nextTrackRadio();
	});
}

function queryDeezer(url, callback) {
	console.log("query deezer");
	request(url, function(error, resp, body) {
		if (!error && resp.statusCode == 200) {
			console.log('200');
			console.log(typeof callback);
			if(typeof callback === "function") {
				callback(JSON.parse(body).data);
			}	
		} else {
			response('Sorry but "Deezer" service is not available right now. Please try later.');
		}
	});
	console.log("done query");
}


function streamData(url, title, endCallback) {
	console.log("stream data");
	var req = request(url);
	var chunks = 0;
	_currentName = _currentName == "track_a" ? "track_b" : "track_a";
	console.log(_currentName);
	req.on('data', (chunk) => {
		chunks += chunk.length;
		debug(`Receiving ${chunk.length} bytes of data...`);
	});
	req.on('end', () => {
		debug(`Full amount of data received : ${chunks} bytes.`);
		response('Now playing "' + title + '" for you.');
		debug("Fetch complete.");
		debug("Joining channel " + _message.member.voiceChannel.name);
		streamAudio('./cache/audio/'+_currentName+'.mp3', endCallback);
	});
	req.pipe(fs.createWriteStream('./cache/audio/'+_currentName+'.mp3'));
}

function streamAudio(path, endCallback) {
	console.log("stream audio");
	_voiceChannel.join()
			.then(connection => {
				return connection.playFile(path);
			})
			.then(dispatcher => {
				dispatcher.on('end', () => {
					debug("Stream end.");
					if(typeof endCallback === "function") endCallback();
				});
				dispatcher.on('speaking', () => {
					debug("Streaming...");
				});
				dispatcher.on('start', () => {
					debug("Stream starts...");
				});
				dispatcher.on('error', console.error);
			})
			.catch(console.error);
}

function debug(content) {
	console.log(nils.id + " - " + content);
}

function containsKeyword(focus, keywords) {
	if (Array.isArray(keywords)) {
		debug("Check keywords...");
		var countIn = 0;
		keywords.forEach(function(keyword) {
			if (focus.indexOf(keyword + " ") != -1 || focus.indexOf(" " + keyword) != -1) countIn++;
		});
		return countIn == keywords.length;
	}
	return focus.indexOf(keywords) != -1;
}

bot.login(nils.data.token);