"use strict";

let __ = require("i18n").__,
    Queue = require("./queue.js"),
    Core = require("./core.js"),
    Track = require("./track.js"),
    Server = require("./../servers/server.js"),
    ErrorPlayer = require("./errorplayer.js");

module.exports = class Player {
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
        this.queue.eventEmitter.addListener(
            this.queue.events.LAST_ITEM_REACHED,
            () => {
                this.alert(__("event_queue_last_item_reached"));
            }
        );
        this.queue.eventEmitter.addListener(
            this.queue.events.QUEUE_CLEARED,
            () => {
                this.alert(__("event_queue_cleared"));
            }
        );
        
        //Core related
        this.core.eventEmitter.addListener(
            this.core.events.STREAM_END,
            () => {
                if (this.checkConnectionAlive()) {
                    this.skip();
                }
            }
        );
    }

    //endregion
    //region COMMUNICATION

    /**
     * Alert / Prompt a message to user channel.
     * @param {String} message Message to prompt to user channel.
     */
    alert(message) {
        this.server.communicator.message(
            this.server.text,
            message
        );
    }

    /**
     * Alert and log an error.
     * @param {ErrorPlayer} error 
     */
    alertError(error) {
        this.alert(error.userMessage);//__("error_global"));
        this.logError(error);
    }

    /**
     * 
     * @param {ErrorPlayer} error 
     */
    logError(error) {
        console.error("Error triggered : " + error.message); //error.stack
    }

    //endregion
    //region ACTIONS

    inspectQueue() {
        let content = this.queue.content;
        if (content.length == 0) {
            this.alert(__("message_player_queue_empty"));
            return;
        }
        let message = "";
        let index = 0;
        content.forEach(
            (track) => {
                if (index == 0) {
                    message += "\n" + __("message_player_queue_now_playing", track.formattedName, track.time);
                } else {
                    message += "\n" + __("message_player_queue_track", index, track.formattedName, track.time);
                }
                index++;
            }
        );
        message = __("message_player_queue_content", message);
        this.alert(message);
    }

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
                    this.alert(__("message_player_queue_feeded", res.formattedName));
                    if (!this.core.isPlaying()) {
                        this.play();
                    }
                }
            );
    }

    /**
     * Play the stream.
     */
    play() {
        if (this.queue.currentTrack == undefined) {
            console.error(__("error_queue_feed_track_undefined"));
            return;
        }
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
             * @param {Track} res Track playing.
             */
            (res) => {
                this.alert(__("message_player_now_playing", res.formattedName));
            }
        ).catch(
            /**
             * @return {ErrorPlayer} Error.
             */
            (rej) => {
                this.alertError(rej);
            }
        );
    }

    /**
     * Pause the stream.
     */
    pause() {
        if (!this.checkConnectionAlive()) {
            return;
        }
        this.core.pause()
            .then(
                () => {
                    this.alert(__("message_player_stream_is_paused"));
                }
            ).catch(
                /**
                 * @param {ErrorPlayer} rej
                 */
                (rej) => {
                    this.alertError(rej);
                }
            );
    }

    /**
     * Resume the stream.
     */
    resume() {
        if (!this.checkConnectionAlive()) {
            return;
        }
        this.core.resume()
            .then(
                () => {
                    this.alert(__("message_player_stream_is_resumed"));
                }
            ).catch(
                /**
                 * @param {ErrorPlayer} rej
                 */
                (rej) => {
                    this.alertError(rej);
                }
            );
    }

    /**
     * Skip the current track.
     */
    next() {
        if (!this.checkConnectionAlive()) {
            return;
        }
        this.core.stop()
            .then()
            .catch(
                /**
                 * @param {ErrorPlayer} rej
                 */
                (rej) => {
                    this.alertError(rej);
                }
            );
    }

    skip() {
        if (!this.checkConnectionAlive()) {
            console.log("Connection is not alive man");
            return;
        }
        this.queue.skip()
            .then(
                /**
                 * @param {String}
                 */
                (res) => {
                    this.alert(res);
                    this.play();
                }
            ).catch(
                /**
                 * @param {ErrorPlayer} rej
                 */
                (rej) => {
                    this.alertError(rej)
                }
            );
    }

    stop() {
        if (this.checkConnectionAlive()) {
            console.log("Player - Stop - Disconnect")
            this.server.voice.connection.disconnect();
        }
        this.core.stop()
            .then(
                /**
                 * @param {String} res
                 */
                (res) => {
                    this.alert("Stream is stopped.");
                }
            ).finally(
                () => {
                    this.queue.clear();
                }
            ).catch(
                /**
                 * @param {ErrorPlayer} rej
                 */
                (rej) => {
                    this.alertError(rej);
                }
            );
    }

    //endregion
    //region CHECk

    /**
     * @return {Boolean} Returns true if connection is alive.
     */
    checkConnectionAlive() {
        if (this.server.voice.connection == null) {
            this.alertError(
                new ErrorPlayer(
                    "error_player_voice_channel_disconnected"
                )
            );
            return false;
        }
        return true;
    }
}