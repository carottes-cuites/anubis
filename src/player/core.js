"use strict";
//import { VoiceConnection } from "discord.js";

let Track = require("./track.js");
let EventEmitter = require('events');
let ErrorCore = require('./errors/errorcore.js');

module.exports = class Core {
    constructor() {
        this.init();
    }

    init() {
        this.streamDispatcher = undefined;
        this.eventEmitter = new EventEmitter();
        this.events = {
            STREAM_START : "event_core_stream_start",
            STREAM_STOPPED : "event_core_stream_stopped",
            STREAM_END : "event_core_stream_end"
        };
        this.errors = {
            ERROR : "global",
            ERROR_STREAM_ALREADY_STARTED : "stream_already_started",
            ERROR_TRACK_NO_DATA : "track_no_data",
            ERROR_TRACK_NO_STREAM_ATTACHED : "track_no_stream_attached"
        }
    }

    /**
     * Plays the track requested.
     * @param {Track} track First item of the queue list.
     * @param {VoiceConnection} connection Voice channel to stream to.
     * @param {Object} options Stream options.
     * @throws {ErrorCore} Core errors.
     */
    play(track, connection, options) {
        return new Promise(
            (resolve, reject) => {
                if (track == null) {
                    reject(this.events.ERROR_TRACK_NO_DATA);
                } else if(track.streamSource == null) {
                    reject(this.events.ERROR_TRACK_NO_STREAM_ATTACHED);
                }
                let dispatcher = connection.playStream(track.streamSource, options);
                this.defineStreamDispatcherEvents(dispatcher);
                resolve(track);
            }
        );
    }

    /**
     * Define stream dispatcher events.
     */
    defineStreamDispatcherEvents(dispatcher) {
        console.info("Define stream dispatcher");
        if (this.streamDispatcher != undefined) {
            this.streamDispatcher = undefined;
        }
        this.streamDispatcher = dispatcher;
        this.streamDispatcher.on("start", () => {
            this.eventEmitter.emit(this.events.STREAM_START);
        });
        this.streamDispatcher.on("end", () => {
            this.eventEmitter.emit(this.events.STREAM_END);
        })
    }

    /**
     * Create stream options.
     * @param {number} seek 0 as default.
     * @param {number} volume From 0 to 1.
     * @param {number} passes Retry UDP lost packages.
     * @param {number} bitrate In kbps. Use "auto" to match channel's bitrate.
     * @return {Object} Stream options model.
     */
    createStreamOptions(seek, volume, passes, bitrate) {
        console.info("Create stream options");
        return {
            seek: seek,
            volume: volume,
            passes: passes,
            bitrate: bitrate
        };
    }

    /**
     * Resumes the stream.
     * @return {Promise}
     */
    resume() {
        console.info("Resume");
        return new Promise((res, rej) => {
            this.streamDispatcher.resume();
            if (!this.streamDispatcher.paused) res("Stream is resumed.");
            else rej("Stream failed to resume.");

        });
    }

    /**
     * Pauses the stream.
     * @return {Promise}
     */
    pause() {
        console.info("Pause");
        return new Promise((res, rej) => {
            this.streamDispatcher.pause();
            if (this.streamDispatcher.paused) res("Stream is paused.");
            else rej("Stream failed to pause.");
        });
    }

    /**
     * Stops the stream.
     * @throws {ErrorCore} Core error.
     */
    stop() {
        return new Promise(
            (res, rej) => {
                try {
                    console.info("Stop");
                    this.streamDispatcher.end();
                    this.streamDispatcher = undefined;
                    res();
                } catch (error) {
                    rej(error);
                }
                //this.eventEmitter.emit(this.events.STREAM_STOPPED);
            }
        );
    }

    /**
     * @return {Boolean}
     */
    isPlaying() {
        console.log("Is playing");
        if (this.streamDispatcher == undefined) {
            return false;
        }
        return !this.streamDispatcher.paused;
    }
}