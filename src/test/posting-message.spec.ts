describe("Feature: Posting a message", () => {
    describe('Rule: A message can contain a maximun of 280 characters', () => {
        test("Alice can post a message on her timeline", () => {
            givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

            whenUserPostsAMessages({
                id: "message-id",
                text: "Hello world",
                author: "Alice"
            });

            thenPostedMessageShouldBe({
                id: "message-id",
                text: "Hello world",
                author: "Alice",
                publishedAt: new Date("2023-01-19T19:00:00.000Z")
            });
        });
    });
});

type Message = { id: string; author: string; text: string; publishedAt: Date; };

let message: Message;
let now: Date;

function givenNowIs(_now: Date) {
    now = _now;
}

function whenUserPostsAMessages(postMessageCommand: { id: string; text: string; author: string; }) {
    message = {
        id: postMessageCommand.id,
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        publishedAt: now
    };
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
    expect(expectedMessage).toEqual(message);
}

