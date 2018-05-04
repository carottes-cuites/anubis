"use strict";

let Track = require("./../streamable/track.js"),
    Announce = require("./../streamable/annouce.js"),
    EventEmitter = require('events'),
    ErrorPlayer = require("./../errors/errorplayer.js"),
    TextToSpeech = require("./tts.js");

module.exports = class Core {
    constructor() {
        this.init();
    }

    init() {
        this.streamDispatcher = undefined;
        this.eventEmitter = new EventEmitter();
        this.tts = new TextToSpeech();
        this.events = {
            STREAM_START : "event_core_stream_start",
            STREAM_STOPPED : "event_core_stream_stopped",
            STREAM_END : "event_core_stream_end"
        };
        this.errors = {
            ERROR : "error_core_global",
            ERROR_STREAM_FAIL_PAUSE : "error_core_stream_fail_pause",
            ERROR_STREAM_FAIL_RESUME : "error_core_stream_fail_resume",
            ERROR_STREAM_ALREADY_STARTED : "error_core_stream_already_started",
            ERROR_STREAM_UNDEFINED : "error_core_stream_undefined",
            ERROR_TRACK_NO_DATA : "error_core_track_no_data",
            ERROR_TRACK_NO_STREAM_ATTACHED : "error_core_track_no_stream_attached"
        }
    }

    /**
     * Plays the track requested.
     * @param {Track} track First item of the queue list.
     * @param {VoiceConnection} connection Voice channel to stream to.
     * @param {Object} options Stream options.
     * @param {Boolean} announceTrackName True if name should be announced vocally before playing.
     * @throws {Error} Core errors.
     */
    play(track, connection, options, announceTrackName) {
        console.info("Core - Play");
        return new Promise(
            (resolve, reject) => {
                if (track == null) {
                    reject(new ErrorPlayer(this.events.ERROR_TRACK_NO_DATA));
                } else if(track.streamSource == null) {
                    reject(new ErrorPlayer(this.events.ERROR_TRACK_NO_STREAM_ATTACHED));
                }
                if (announceTrackName) {
                    this.tts.fetchAnnounceFromText(
                        "Now playing: " + track.formattedName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,', '),
                        this.tts.languages.en
                    ).then(
                        /**
                         * @param {Announce} res
                         */
                        (res) => {
                            let dispatcherAnnounce = connection.playStream(res.streamUrl, options);
                            dispatcherAnnounce.on("end", () => {
                                this.stream(connection, track, options);
                                dispatcherAnnounce = undefined;
                            });
                        }
                    ).catch(
                        /**
                         * @param {Error} rej
                         */
                        (rej) => {
                            console.error(err);
                        }
                    );
                } else {
                    this.stream(connection, track, options);
                    resolve(track);
                }
                
            }
        );
    }

    /**
     * Stream content.
     * @param {VoiceConnection} connection 
     * @param {Track} track 
     * @param {Object} options 
     */
    stream(connection, track, options) {
        let dispatcherTrack = connection.playStream(track.streamSource, options);
        this.defineStreamDispatcherEvents(dispatcherTrack);
    }

    /**
     * Define stream dispatcher events.
     */
    defineStreamDispatcherEvents(dispatcher) {
        console.info("Core - Define stream dispatcher");
        if (this.streamDispatcher != undefined) {
            this.streamDispatcher = undefined;
        }
        this.streamDispatcher = dispatcher;
        this.streamDispatcher.on("start", () => {
            this.eventEmitter.emit(this.events.STREAM_START);
        });
        this.streamDispatcher.on("end", () => {
            this.streamDispatcher = undefined;
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
        console.info("Core - Create stream options");
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
        console.info("Core - Resume");
        return new Promise((res, rej) => {
            if(this.streamDispatcher != undefined) {
                this.streamDispatcher.resume();
            } else {
                rej(new ErrorPlayer(this.errors.ERROR_STREAM_UNDEFINED));
            }
            if (!this.streamDispatcher.paused) res();
            else {
                rej(
                    new ErrorPlayer(this.errors.ERROR_STREAM_FAIL_RESUME)
                );
            }
        });
    }

    /**
     * Pauses the stream.
     * @return {Promise}
     */
    pause() {
        console.info("Core - Pause");
        return new Promise((res, rej) => {
            if(this.streamDispatcher != undefined) {
                this.streamDispatcher.pause();
            } else {
                rej(new ErrorPlayer(this.errors.ERROR_STREAM_UNDEFINED));
            }
            if (this.streamDispatcher.paused) res();
            else {
                rej(
                    new ErrorPlayer(this.errors.ERROR_STREAM_FAIL_PAUSE)
                );
            }
        });
    }

    /**
     * Stops the stream.
     * @throws {ErrorPlayer} Core error.
     */
    stop() {
        console.info("Core - Stop");
        return new Promise(
            (res, rej) => {
                try {
                    if (this.streamDispatcher == undefined) {
                        throw new ErrorPlayer(this.errors.ERROR_STREAM_UNDEFINED);
                    }
                    this.streamDispatcher.end();
                    this.streamDispatcher = undefined;
                } catch (error) {
                    if(!typeof error == ErrorPlayer) {
                        error = new ErrorPlayer(this.errors.ERROR);
                    }
                    rej(error);
                }
                res();
                //this.eventEmitter.emit(this.events.STREAM_STOPPED);
            }
        );
    }

    /**
     * @return {Boolean}
     */
    isPlaying() {
        console.log("Core - Is playing ?");
        if (this.streamDispatcher == undefined) {
            console.log("Stream doesn't exist.");
            return false;
        }
        return !this.streamDispatcher.paused;
    }
}