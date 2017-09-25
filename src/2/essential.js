module.exports = class Essential {
    
    constructor(anubis) {
        this.init();
        this.anubis = anubis;
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