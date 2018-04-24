"use strict";

let Track = require("./track.js");
let EventEmitter = require('events');

module.exports = class Queue {
    constructor() {
        this.init();
    }

    init() {
        this.mList = [];
        this.mEventEmitter = new EventEmitter();
        this.mEvents = {
            QUEUE_CLEARED : "event_queue_cleared",
            LAST_ITEM_REACHED : "event_last_item",
            QUEUE_FEEDED : "event_queue_feeded",
        }
        this.mErrors = {
            ERROR : "error_queue",
            ERROR_SKIP_QUEUE_EMPTY : "error_queue_skip_empty"
        }
    }

    clear() {
        this.mList = [];
        this.mEventEmitter.emit(this.mEvents.QUEUE_CLEARED);
    }

    /**
     * 
     * @param {Track} track 
     */
    feed(track) {
        return new Promise(
            (resolve, reject) => {
                try {
                    this.mList.push(track);
                    resolve(track);
                } catch(error) {
                    reject(error);
                }
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
        return new Promise((resolve, reject) => {
            if (this.mList.length == 0) reject("Queue is empty");
            this.mList.shift();
            if( this.mList.length == 1) {
                resolve("Last item reached");
                return;
            }
            resolve("Skipping");
        });
        
    }
}