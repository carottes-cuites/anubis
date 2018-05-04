"use strict";

module.exports = class StreamItem {
    /**
     * 
     * @param {String} prefix
     */
    constructor(prefix) {
        this.mId = prefix + "-" + new Date().getTime();
    }

    /**
     * @return {String} Id
     */
    get id() {
        return this.mId;
    }
}