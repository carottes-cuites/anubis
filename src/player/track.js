"use strict";

module.exports = class Track {
    /**
     * 
     * @param {String} title 
     * @param {String} artist 
     * @param {ReadableStream} streamSource 
     * @param {Int} time
     */
    constructor(title, artist, streamSource, time) {
        this.mId = "track-" + new Date().getTime();
        this.mTitle = title;
        this.mArtist = artist;
        this.mStreamSource = streamSource;
        this.mTime = time;
    }

    /**
     * @return {String} Id
     */
    get id() {
        return this.mId;
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
        var sec_num = time; // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+'h '+minutes+'m '+seconds;
    }
}