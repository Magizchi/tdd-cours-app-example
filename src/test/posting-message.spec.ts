import { DateProvider, Message, MessageRepository, PostMessageCommand, PostMessageUseCase } from "../post-message-usecase";

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

let message: Message;
let now: Date;

function givenNowIs(_now: Date) {
    now = _now;
}

class InMemoryMessageRepository implements MessageRepository {
    save(msg: Message): void {
        message = msg;
    }
}

class StubDateProvider implements DateProvider {
    now: Date;
    getNow(): Date {
        return this.now;
    }
}


const messageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
);

function whenUserPostsAMessages(postMessageCommand: PostMessageCommand) {
    postMessageUseCase.handle(postMessageCommand);
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
    expect(expectedMessage).toEqual(message);
}
