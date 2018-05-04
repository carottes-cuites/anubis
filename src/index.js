"use strict";
//region VARIABLES
let Main = require("./main.js");
let app = new Main();
//endregion
//region DEBUGGER
process.on(
    'unhandledRejection',
    (reason, p) => {
        console.error("Error : \"unhandledRejection\"");
        console.error(reason);
    }
);
//endregion
//region SCRIPT
app.prepare();
app.ready();
app.run();
//endregion