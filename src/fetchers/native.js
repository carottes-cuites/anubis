"use strict";

let Anubis = require('./../bot/anubis.js'),
    Fetcher = require('./../fetchers/fetcher.js'),
    __ = require("i18n").__,
    Message = require("discord.js").Message;

module.exports = class Native extends Fetcher {
    //region INITIALIZER

    /**
     * Constructor
     * @param {Anubis} anubis Bot.
     */
    constructor(anubis) {
        super('native', anubis);
    }

    prepare() {
        this.addCommand('REBOOT', this.reboot);
        this.addCommand('PLAY', this.resume);
        this.addCommand('PAUSE', this.pause);
        this.addCommand('NEXT', this.next);
        this.addCommand('STOP', this.stop);
        this.addCommand('HELP', this.help);
        this.addCommand('CURRENT', this.current);
        this.addCommand('QUEUE', this.queue);
        this.addCommand('MUTE', this.mute);
        this.addCommand('UNMUTE', this.unmute);
    }

    //endregion
    //region CONTROLS
    
    /**
     * Resume stream if paused.
     * @param {Native} that 
     * @param {Object} data 
     * @param {Message} message 
     */
    resume(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.resume();//.remote('play');
    }

    /**
     * Skip current track.
     * @param {Native} that 
     * @param {Object} data 
     * @param {Message} message 
     */
    next(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.next();
        //that.anubis.smanager.getServer(data.serverID).player.remote('next');
    }

    /**
     * Pause current stream.
     * @param {Native} that 
     * @param {Object} data 
     * @param {Message} message 
     */
    pause(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.pause();//remote('pause');
    }

    /**
     * Stop current stream.
     * @param {Native} that 
     * @param {Object} data 
     * @param {Message} message 
     */
    stop(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.stop();
        //that.anubis.smanager.getServer(data.serverID).player.remote('stop');
    }

    //endregion
    //region QUEUE

    /**
     * Get current track.
     * @param {Native} that 
     * @param {Object} data 
     * @param {Message} message 
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
     * List queue content.
     * @param {Native} that 
     * @param {Object} data 
     * @param {Message} message 
     */
    queue(that, data, message) {
        that.anubis.smanager.getServer(data.serverID).player.inspectQueue();
    }

    //endregion
    //region SYSTEM

    /**
     * Reboot the bot session.
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    reboot(that, data, message) {
        let server = that.anubis.smanager.getServer(data.serverID);
        that.anubis.communicator.messageSystem(
            server.text,
            "Reboot initiated (it can take few seconds before being alive again)."
        ).then(() => {
            that.anubis.reboot();
        });
    }

    /**
     * List help methods.
     * @param {Native} that 
     * @param {Object} data 
     * @param {Message} message 
     */
    help(that, data, message) {
        let server = that.anubis.smanager.getServer(data.serverID);
        let msg = "Request an action from the bot :\n"
        + "\t@bot-name {action}\n"
        + "\nSystem action\n"
        + "\t{help}\t\tList bot's commands.\n"
        + "\t{reboot}\t\tReboot the bot.\n"
        + "\t{update}\t\tUpdate the bot.\n"
        + "\nVoice action :\n"
        + "\t{mute | silent | silence | m} Silence the bot track announcements on stream.\n"
        + "\t{unmute | noisy | n} The bot makes announcements on stream track.\n"
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
        + "\nTwitch service :\n"
        + "\t[twitch | tw] *stream_name*\t\tPlay a stream from Twitch.\n";
        that.anubis.communicator.privateMessage(
            message.author,
            msg
        );
    }

    //endregion
    //region VOICE

    /**
     * 
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    mute(that, data, message) {
        let server = that.anubis.smanager.getServer(data.serverID);
        server.player.setAnnouncementStatus(false);
        that.anubis.communicator.message(
            server.text,
            __("message_mute")
        );
    }

    /**
     * 
     * @param {Native} that 
     * @param {*} data 
     * @param {*} message 
     */
    unmute(that, data, message) {
        let server = that.anubis.smanager.getServer(data.serverID);
        server.player.setAnnouncementStatus(true);
        that.anubis.communicator.message(
            server.text,
            __("message_unmute")
        );
    }

    //endregion
}