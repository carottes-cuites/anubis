"use strict";

module.exports = class ErrorCore extends Error {
    constructor(message) {
        super("error_core_" + message);
    }
}