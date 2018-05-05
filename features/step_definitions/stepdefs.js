let assert = require('assert'),
    { Given, When, Then } = require('cucumber'),
    Queue = require("./../../src/player/components/queue.js"),
    Track = require('./../../src/player/streamable/track.js');

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

When('queue is feeded with the valid track', function () {
    this.currentQueueSize = this.queue.content.length;
    this.queue.feed(this.validTrack);
});

Then('queue length expands', function () {
    assert(
        this.currentQueueSize < this.queue.content.length,
        "Queue length hasn't changed"
    );
});

Then('valid track is added to the end of the queue', function () {
    assert(
        this.queue.content[this.queue.content.length -1].id == this.validTrack.id,
        "Valid track hasn't been added to the end of the queue"
    );
});