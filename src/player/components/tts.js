"use strict";

let GoogleTTS = require("google-tts-api"),
    Announce = require("./../streamable/annouce");

module.exports = class TextToSpeech {
    constructor() {
        this.init();
    }

    init() {
        this.mLanguages = {
            en: 'en',
            fr: 'fr'
        };
        this.announces = {};
    }

    /**
     * Get Announce from text.
     * @param {String} message 
     * @return {Promise} Promise.
     */
    fetchAnnounceFromText(message, language) {
        return new Promise(
            (resolve, reject) => {
                if (this.announces[message] != undefined) {
                    console.info("Announce already known.");
                    resolve(this.announces[message]);
                    return;
                }
                if (message.length >= 200) {
                    console.info("Beware you should only give message with a length lower than 200 characters.");
                }
                GoogleTTS(message, language, 1)
                .then((url) => {
                    console.info("TextToSpeech - URL obtained.");
                    this.announces[message] = new Announce(message, url, language);
                    resolve(this.announces[message]);
                })
                .catch((err) => {
                    console.info("TextToSpeech - Failed to obtain URL.");
                    reject(err);
                });
            }
        );
    }

    /**
     * @return {Object} Language list supported.
     */
    get languages() {
        return this.mLanguages;
    }
}