"use strict";

let Anubis = require('./../bot/anubis.js');
const Fetcher = require('./../fetchers/fetcher.js');

module.exports = class Native extends Fetcher {
    /**
     * 
     * @param {Anubis} anubis 
     */
    constructor(anubis) {
        super('native', anubis);
    }

    prepare() {
        this.addCommand('PLAY', this.play);
        this.addCommand('PAUSE', this.pause);
        this.addCommand('NEXT', this.next);
        this.addCommand('STOP', this.stop);
        this.addCommand('HELP', this.help);
        this.addCommand('CURRENT', this.current);
        this.addCommand('QUEUE', this.queue);
    }
    
    play(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.remote('play');
    }

    /**
     * 
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    next(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.next();
        //that.anubis.smanager.getServer(data.serverID).player.remote('next');
    }

    pause(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.remote('pause');
    }

    stop(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.stop();
        //that.anubis.smanager.getServer(data.serverID).player.remote('stop');
    }

    current(that, data, message) {
        var server = that.anubis.smanager.getServer(data.serverID);
        var track = server.player.currentTrack;
        that.anubis.communicator.message(
            server.text,
            'Now playing "' + track.title + ' - ' + track.artist + '"'
        );
    }

    queue(that, data, message) {
        var server = that.anubis.smanager.getServer(data.serverID);
        let msg = "Queue list :";
        let index = 0;
        if (server.player.queue.length == 0) {
            msg = "Queue list is empty.";
        } else {
            for (let index = 0; index < server.player.queue.length; index++) {
                let item = server.player.queue[index];
                msg += "\n";
                msg += (index + 1) + " :: " + item.title + (item.artist != "" ? " - " + item.artist : "");
            }
        }
        that.anubis.communicator.message(server.text, msg);
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