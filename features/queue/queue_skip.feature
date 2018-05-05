Feature: Skip queue

    Skip queue.

    Scenario: Skip queue empty
        Given a queue
        When queue is skipped
        Then queue skip error empty is returned

    Scenario: Skip queue feeded with one item
        Given a queue feeded
        When queue is skipped
        Then queue length shrinks
        And queue skip error empty is returned

    Scenario: Skip queue feeded with more than one item
        Given a queue feeded with two items
        When queue is skipped
        Then queue length shrinks