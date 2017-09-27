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
}