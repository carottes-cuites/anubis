"use strict";

let Track = require("./../streamable/track.js"),
    EventEmitter = require('events'),
    ErrorPlayer = require("./../errors/errorplayer.js"),
    __ = require("i18n").__;

module.exports = class Queue {
    constructor() {
        this.init();
    }

    init() {
        this.mList = [];
        this.mEventEmitter = new EventEmitter();
        this.mEvents = {
            QUEUE_CLEARED : "event_queue_cleared",
            LAST_ITEM_REACHED : "event_queue_last_item_reached",
            QUEUE_FEEDED : "event_queue_feeded",
            SKIPPING: "event_queue_skipping"
        }
        this.mErrors = {
            ERROR : "error_queue",
            ERROR_QUEUE_FEED_TRACK_UNDEFINED : "error_queue_feed_track_undefined",
            ERROR_QUEUE_SKIP_EMPTY : "error_queue_skip_empty"
        }
    }

    clear() {
        console.info("Queue - Clear");
        if(this.mList.length > 0) {
            this.mList = [];
            this.mEventEmitter.emit(this.mEvents.QUEUE_CLEARED);
        }
    }

    /**
     * 
     * @param {Track} track 
     */
    feed(track) {
        console.info("Queue - Feed");
        return new Promise(
            (resolve, reject) => {
                if (track == undefined) {
                    reject(
                        new ErrorPlayer(this.errors.ERROR_QUEUE_FEED_TRACK_UNDEFINED)
                    );
                }
                this.mList.push(track);
                resolve(track);
            }
        );
    }

    /**
     * @return {Object}
     */
    get errors() {
        return this.mErrors;
    }

    /**
     * @return {Object}
     */
    get events() {
        return this.mEvents;
    }

    /**
     * @return {Track}
     */
    get currentTrack() {
        return this.mList[0];
    }

    /**
     * @return {Track}
     */
    get nextTrack() {
        return this.mList[1];
    }

    /**
     * @return {EventEmitter}
     */
    get eventEmitter() {
        return this.mEventEmitter;
    }

    /**
     * @return {Track[]} Queue list
     */
    get content() {
        return this.mList;
    }

    skip() {
        console.info("Queue - Skip");
        return new Promise((resolve, reject) => {
            if (this.mList.length == 0) {
                reject(
                    new ErrorPlayer(this.errors.ERROR_QUEUE_SKIP_EMPTY)
                );
            }
            this.mList.shift();
            switch (this.mList.length) {
                case 0:
                    reject(
                        new ErrorPlayer(this.errors.ERROR_QUEUE_SKIP_EMPTY)
                    );
                break;
                case 1:
                    resolve(__(this.events.LAST_ITEM_REACHED));
                break;
                default:
                    resolve(__(this.events.SKIPPING));
                break;
            }
        });
    }
}