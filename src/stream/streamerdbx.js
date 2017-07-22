const Streamer = require("./streamer.js");
const Dropbox = require('dropbox');
const Tool = require("../misc/tool.js");

module.exports = class StreamerDropbox extends Streamer {
	constructor(nils) {
		super(nils);
		this.init();
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
		console.log("jgbgib");
		console.log(name)
		//Check cache first.
		// If not fetch it and locallyze it.
		this.files.forEach(file => {
			if (file.name == name) {
				this.dbx.sharingGetSharedLinkFile({url: file.url})
					.then(data => {
						this.setDataInFile(data);
				});
			}
		})
	}

	setDataInFile(data) {
		console.log("download file");
		fs.writeFile(
			'./cache/audio/' + data.name,
			data.fileBinary,
			'binary',
			err => {
				if (err) { throw err; }
				console.log('File: ' + data.name + ' saved.');
				this.streamAudio('./cache/audio/' + data.name);
			}
		);
	}
}