"use strict";

let Queue = require("./queue.js");
let Core = require("./core.js");
let Track = require("./track.js");
let Server = require("./../servers/server.js");

module.exports = class PlayerReworked {
    //region INITIALIZER

    /**
     * Constructor.
     * @param {Server} server 
     */
    constructor(server) {
        this.server = server;
        this.init();
    }

    /**
     * Initializer.
     */
    init() {
        this.queue = new Queue();
        this.core = new Core();
        this.addEvents();
    }

    /**
     * Add events to player.
     */
    addEvents() {
        //Queue related
        /*this.queue.eventEmitter.addListener(
            this.queue.events.QUEUE_FEEDED,
            () => {
                if (this.core.isPlaying()) return;
                this.play();
            }
        );*/
        this.queue.eventEmitter.addListener(
            this.queue.events.LAST_ITEM_REACHED,
            () => {
                this.alert("Last track to play");
            }
        );
        this.queue.eventEmitter.addListener(
            this.queue.events.QUEUE_CLEARED,
            () => {
                this.alert("The queue is empty.");
            }
        );
        
        //Core related
        /*this.core.eventEmitter.addListener(
            this.core.events.STREAM_START,
            () => {
                this.alert("Stream has started.")
            }
        );
        this.core.eventEmitter.addListener(
            this.core.events.STREAM_PAUSED,
            () => {
                this.alert("Stream paused.")
            }
        );
        this.core.eventEmitter.addListener(
            this.core.events.STREAM_PAUSED,
            () => {
                this.alert("Stream paused.")
            }
        );*/
        //pause
        //stop
    }

    //endregion
    //region COMMUNICATION

    /**
     * Alert / Prompt a message to user channel.
     * @param {String} message Message to prompt to user channel.
     */
    alert(message) {
        console.log(message);
        this.server.communicator.message(
            this.server.text,
            message
        );
    }

    /**
     * 
     * @param {String} message 
     * @param {Error} error 
     */
    alertError(message, error) {
        this.alert(message);
        console.error(error.message);
    }

    //ENDREGION
    //region ACTIONS

    /**
     * Feed the queue with a track.
     * @param {Track} track Track to feed in queue.
     */
    feed(track) {
        this.queue.feed(track)
            .then(
                /**
                 * @param {Track} res
                 */
                (res) => {
                    this.alert("Queue feeded with " + res.formattedName);
                    if (this.core.isPlaying()) return;
                    this.play();
                }
            );
    }

    /**
     * Play the stream.
     */
    play() {
        this.server.voice.join().then(
            connection => {
                return this.core.play(
                    this.queue.currentTrack,
                    connection,
                    this.core.createStreamOptions(
                        0, 1, 3, "auto"
                    )
                );
            }
        ).then(
            /**
             * @param {Track} res
             */
            (res) => {
                let message = "Now playing " + res.formattedName;
                this.alert(message);
            }
        ).catch(
            (rej) => {
                this.alert(rej);
            }
        );
    }

    /**
     * Pause the stream.
     */
    pause() {
        this.core.pause()
            .then(this.alert)
            .catch(
                /**
                 * @param {String} rej
                 */
                (rej) => {
                    this.alertError("Error on pause", rej);
                }
            );
    }

    /**
     * Resume the stream.
     */
    resume() {
        this.core.resume()
            .then(this.alert)
            .catch(
                /**
                 * @param {String} rej
                 */
                (rej) => {
                    this.alertError("Error on resume", rej);
                }
            );
    }

    /**
     * Skip the current track.
     */
    next() {
        this.core.stop()
            .then(
                () => {
                    this.queue.skip();
                    this.play();
                }
            ).catch(
                /**
                 * @param {String} rej
                 */
                (rej) => {
                    this.alertError("Error on next", rej);
                }
            );
    }

    stop() {
        this.server.voice.connection.disconnect();
        this.core.stop()
            .then(
                /**
                 * @param {String} res
                 */
                (res) => {
                    this.alert(res);
                    this.queue.clear();
                }
            ).catch(
                /**
                 * @param {String} rej
                 */
                (rej) => {
                    this.alertError("Error on stop", rej);
                }
            );
    }

    //endregion
}