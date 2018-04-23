"use strict";

let Anubis = require('./../bot/anubis.js');

module.exports = class Essential {
    /**
     * 
     * @param {Anubis} anubis 
     */
    constructor(anubis) {
        this.init();
        this.mAnubis = anubis;
    }

    get anubis() {
        return this.mAnubis;
    }

    init() {}

    prepare() {}

    ready() {}

    run() {}

    format(message, args) {
        var msgs = message.split('%s');
        var index = 0;
        message = "";
        msgs.forEach(msg => {
            message += msg + (index < msgs.length-1 ? args[index] : "");
            index++;
        });
        return message;
    }
}