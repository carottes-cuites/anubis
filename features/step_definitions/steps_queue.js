//region VARIABLES

let assert = require('assert'),
    {
        Given,
        When,
        Then
    } = require('cucumber'),
    Queue = require("./../../src/player/components/queue.js"),
    Track = require('./../../src/player/streamable/track.js');

//endregion
//region GIVEN

Given('a queue', function () {
    this.queue = new Queue();
});

Given('a valid track', function () {
    this.validTrack = new Track(
        "template title",
        "template artist",
        "",
        0
    );
});

Given('a queue feeded', function () {
    this.queue = new Queue();
    this.queue.feed(
        new Track(
            "template title",
            "template artist",
            "",
            0
        )
    );
});

Given('a queue feeded with two items', function () {
    this.queue = new Queue();
    this.queue.feed(
        new Track(
            "template title 1",
            "template artist 1",
            "",
            0
        )
    );
    this.queue.feed(
        new Track(
            "template title 2",
            "template artist 2",
            "",
            0
        )
    );
});

//endregion
//region WHEN

When('queue is feeded with the valid track', function () {
    this.currentQueueSize = this.queue.content.length;
    this.queue.feed(this.validTrack);
});

When('queue is cleared', function () {
    this.currentQueueSize = this.queue.content.length;
    this.queue.clear();
});

When('queue is skipped', function () {
    this.currentQueueSize = this.queue.content.length;
    return new Promise(
        (resolve, reject) => {
            this.queue.skip().catch(
                (rej) => {
                    this.skipError = rej;
                    resolve();
                }
            );
        }
    );
});

//endregion
//region THEN

Then('queue length expands', function () {
    assert(
        this.currentQueueSize < this.queue.content.length,
        "Queue length hasn't changed"
    );
});

Then('valid track is added to the end of the queue', function () {
    assert(
        this.queue.content[this.queue.content.length - 1].id == this.validTrack.id,
        "Valid track hasn't been added to the end of the queue"
    );
});

Then('queue is empty', function () {
    assert(this.queue.content.length == 0, "Queue is not empty");
});

Then('queue skip error empty is returned', function () {
    assert(
        this.skipError != undefined,
        "No skip error is detected when it is expected to be."
    );
});

Then('queue length shrinks', function () {
    assert(
        this.queue.content.length < this.currentQueueSize,
        "Queue size hasn't shrinked"
    );
});

//endregion