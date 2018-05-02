"use strict";

let Anubis = require('./../bot/anubis.js'),
    Fetcher = require('./../fetchers/fetcher.js'),
    __ = require("i18n").__;

module.exports = class Native extends Fetcher {
    /**
     * 
     * @param {Anubis} anubis 
     */
    constructor(anubis) {
        super('native', anubis);
    }

    prepare() {
        this.addCommand('PLAY', this.resume);
        this.addCommand('PAUSE', this.pause);
        this.addCommand('NEXT', this.next);
        this.addCommand('STOP', this.stop);
        this.addCommand('HELP', this.help);
        this.addCommand('CURRENT', this.current);
        this.addCommand('QUEUE', this.queue);
    }
    
    /**
     * 
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    resume(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.resume();//.remote('play');
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

    /**
     * 
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    pause(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.pause();//remote('pause');
    }

    /**
     * 
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    stop(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.stop();
        //that.anubis.smanager.getServer(data.serverID).player.remote('stop');
    }

    /**
     * 
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    current(that, data, message) {
        var server = that.anubis.smanager.getServer(data.serverID);
        var track = server.player.currentTrack;
        that.anubis.communicator.message(
            server.text,
            'Now playing "' + track.title + ' - ' + track.artist + '"'
        );
    }

    /**
     * 
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    queue(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.inspectQueue();
        return;
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

    /**
     * 
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    help(that, data, message) {
        let server = that.anubis.smanager.getServer(data.serverID);
        let msg = "Request an action from the bot :\n"
        + "\t@bot-name {action}\n"
        + "\nSystem action\n"
        + "\t{help}\t\tList bot's commands.\n"
        + "\t{reboot}\t\tReboot the bot.\n"
        + "\t{update}\t\tUpdate the bot.\n"
        + "\nStream action :\n"
        + "\t{queue | q}\t\tList the queue content.\n"
        + "\t{clean}\t\tClean queue content.\n"
        + "\t{next}\t\tSkip current track.\n"
        + "\t{stop}\t\tStop the stream. It will also disconnect the bot from the voice channel and empty its queue.\n"
        + "\t{pause}\t\tPause the stream.\n"
        + "\t{resume | play}\t\tResume the stream paused.\n"
        + "\nRequest a service :\n"
        + "\t@bot-name [service] (module) *parameter*\t\n"
        + "\nYoutube service :\n"
        + "\t[youtube | yt] *video_id*\t\tPlay an audio stream from Youtube.\n"
        + "\t[youtube | yt] (playlist | pl) *playlist_id*\t\tPlay an audio stream playlist from Youtube.\n"
        + "\nDeezer service :\n"
        + "\t[deezer | dzr] *track_name*\t\tPlay a track sample from Deezer.\n"
        + "\t[deezer | dzr] (artist) *artist_name*\t\tPlay an artist's top track sample from Deezer.\n"
        + "\t[deezer | dzr] (mix | radio) *mix_genre*\t\tPlay a mix track's sample batch from Deezer.\n"
        + "\tTwitch service :\n"
        + "\t[twitch | tw] *stream_name*\t\tPlay a stream from Twitch.";
        let oldmsg = 'Anubis is an audio-broadcast assistant, which allows you to share audio stream\'s simultaneously with your bitches.\n\n'
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
            + '* Go fuck yourself : origin';
        console.log(message);
        that.anubis.communicator.privateMessage(
            message.author,
            msg
        );
    }
}