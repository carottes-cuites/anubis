Feature: Clear queue

    Clear queue.

    Scenario: Clear queue feeded
        Given a queue feeded
        When queue is cleared
        Then queue is empty

    Scenario: Clear queue already empty
        Given a queue
        When queue is cleared
        Then queue is empty