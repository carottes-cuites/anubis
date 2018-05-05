Feature: Feed queue

    Feed queue.

    Scenario: Feed queue with valid track data
        Given a queue
        And a valid track
        When queue is feeded with the valid track
        Then queue length expands
        And valid track is added to the end of the queue