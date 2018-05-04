"use strict";

let StreamItem = require("./streamItem.js");

module.exports = class Track extends StreamItem {
    /**
     * 
     * @param {String} title 
     * @param {String} artist 
     * @param {ReadableStream} streamSource 
     * @param {Int} time
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
     * @return {Int} Time integer
     */
    get time() {
        return this.mTime;
    }

    /**
     * Time formatted.
     * @return {String} Formatted time.
     */
    get formattedTime() {
        if (this.mTime == 0) return "LIVE";
        let sec_num = this.mTime; // don't forget the second param
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+'h '+minutes+'m '+seconds;
    }
}