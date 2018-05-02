"use strict";

let __ = require("i18n").__;

module.exports = class ErrorPlayer extends Error {
    constructor(errorCode, userMessage) {
        super(errorCode);
        this.mUserMessage = __(errorCode);
    }

    get userMessage() {
        return this.mUserMessage;
    }
}