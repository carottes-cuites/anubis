const Streamer = require("./streamer.js");
const Dropbox = require('dropbox');
const Tool = require("../misc/tool.js");

module.exports = class StreamerDropbox extends Streamer {
	constructor(nils) {
		super(nils);
	}

	init() {
		super.init();
		this.dbx = new Dropbox({
			accessToken: this.nils.config.dropbox.token
		});
		this.files = new Array();
	}

	prepare() {
		this.fetchFiles();
	}

	fetchFiles() {
		this.dbx.filesListFolder({path:''})
			.then(response => {
				this.sharizeFiles(response.entries);
			}
		);
	}

	sharizeFiles(files) {
		files.forEach(file => {
			this.dbx.sharingCreateSharedLink({ path: file.path_display })
				.then(response => {
					this.files.push({
						name: file.name,
						url: response.url.split('?')[0]
					});
					Tool.debug("Files sharized", this.files);
				});
		})
	}

	streamFile(name, playFile) {
		playFile = true;
		Tool.debug("Play file " + name);
		//Check cache first.
		// If not fetch it and locallyze it.
		this.files.forEach(file => {
			if (file.name == name) {
				console.log("dahd ahdahhdha "+ file.url);
				this.dbx.filesGetTemporaryLink(
					{path:'/' + name}//[JSON.stringify({path:file.url})]
				).then(
					(res) => {
						console.log(res);
						this.streamAudio(res.link);
					}, (err) => {
						console.log(err);
				});
				return;
				this.dbx.sharingGetSharedLinkFile({url: file.url})
					.then(data => {
						this.setDataInFile(data);
				});
			}
		})
	}

	setDataInFile(data) {
		Tool.debug("Download file " + data.name);
		fs.writeFile(
			'./cache/audio/' + data.name,
			data.fileBinary,
			'binary',
			err => {
				if (err) { throw err; }
				Tool.debug('File "' + data.name + '" saved.');
				this.streamAudio('./cache/audio/' + data.name);
			}
		);
	}
}