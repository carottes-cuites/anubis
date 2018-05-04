"use strict";

let StreamItem = require("./streamItem.js");

module.exports = class Announce extends StreamItem {
    /**
     * 
     * @param {String} message 
     * @param {String} streamURL 
     * @param {String} language 
     */
    constructor(message, streamURL, language) {
        super("announce");
        this.mMessage = message;
        this.mStreamURL = streamURL;
        this.mLanguage = language;
    }

    get message() {
        return this.mMessage;
    }

    get streamUrl() {
        return this.mStreamURL;
    }

    get language() {
        return this.mLanguage;
    }
}