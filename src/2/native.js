"use strict";

const Fetcher = require('./fetcher.js');

module.exports = class Native extends Fetcher {
    constructor(anubis) {
        super('native', anubis);
    }

    prepare() {
        this.addCommand('PLAY', this.play);
        this.addCommand('PAUSE', this.pause);
        this.addCommand('NEXT', this.next);
        this.addCommand('PREVIOUS', this.previous);
        this.addCommand('STOP', this.stop);
        this.addCommand('HELP', this.help);
    }
    
    play(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.remote('play');
    }

    previous(that, data, message) {
        //that.anubis.smanager.getServer(data.serverID).player.remote('previous');
    }

    next(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.remote('next');
    }

    pause(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.remote('pause');
    }

    stop(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.remote('stop');
    }

    help(that, data, message) {
        var server = that.anubis.smanager.getServer(data.serverID);
        that.anubis.communicator.message(
            server.text,
            'Anubis is an audio-broadcast assistant, which allows you to share audio stream\'s simultaneously with your bitches.\n\n'
            + 'The command structure should look like that one:\n'
            + '"@<bot_name> <service> <arguments> <query>"\n'
            + 'Here is the list of commands you can use with the Anubis :\n\n'
            + 'Player :\n'
            + '* Resume : play / resume\n'
            + '* Pause : pause\n'
            + '* Stop : stop\n'
            + '* Next : next\n\n'
            + 'Deezer <dzr / deezer>:\n'
            + '* Add content to queue : <your_query>'
            + '* INCOMING : Feed queue with an artist soundtrack : -artist <artist_name>'
            + '* INCOMING : Feed queue with a genre soundtrack : -mix <genre_name>\n\n'
            + 'Twitch <tw / twitch>:\n'
            + '* Add audio-stream to queue: <your_query>\n\n'
            + 'Bonus:\n'
            + '* Go fuck yourself : origin'
        );
    }
}