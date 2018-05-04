"use strict";

let StreamItem = require("./streamItem.js");

module.exports = class Track extends StreamItem {
    /**
     * 
     * @param {String} title 
     * @param {String} artist 
     * @param {ReadableStream} streamSource 
     * @param {String} time
     */
    constructor(title, artist, streamSource, time) {
        super("track");
        this.mTitle = title;
        this.mArtist = artist;
        this.mStreamSource = streamSource;
        this.mTime = time;
    }

    /**
     * @return {String} Track's formatted name.
     */
    get formattedName() {
        return this.title + (this.artist != "" ? " - " + this.artist : "");
    }

    /**
     * @return {String} Title
     */
    get title() {
        return this.mTitle;
    }

    /**
     * @return {String} Artist
     */
    get artist() {
        return this.mArtist;
    }

    /**
     * @return {ReadableStream} Stream source
     */
    get streamSource() {
        return this.mStreamSource;
    }

    /**
     * @return {String} Time in hh:mm:ss
     */
    get time() {
        return this.mTime;
    }
}