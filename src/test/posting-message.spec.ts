import { DateProvider, EmptyMessageError, Message, MessageRepository, MessageTooLongError, PostMessageCommand, PostMessageUseCase } from "../post-message-usecase";

describe("Feature: Posting a message", () => {
    describe('Rule: A message can contain a maximum of 280 characters', () => {
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

        test("Alice cannot post a messsage with more than 280 character", () => {
            const textWithLengthOf281 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec semper lacus eu interdum ultrices. Vestibulum pharetra magna turpis, in consectetur nulla mollis ut. Suspendisse finibus dapibus feugiat. Proin quis leo vitae dolor tempus blandit vitae vel neque. Pellentesque aliquam. ";
            givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

            whenUserPostsAMessages({
                id: "message-id",
                text: textWithLengthOf281,
                author: "Alice"
            });

            thenErrorShouldBe(MessageTooLongError);
        });
    });
    describe('Rule: Message cannot be emppty', () => {
        test("Alice cannot post empty message", () => {
            givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            whenUserPostsAMessages({
                id: "message-id",
                text: "",
                author: "Alice"
            });
            thenErrorShouldBe(EmptyMessageError);
        });

    });
});

let message: Message;
let thrownError: Error;

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

function givenNowIs(_now: Date) {
    dateProvider.now = _now;
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
);

function whenUserPostsAMessages(postMessageCommand: PostMessageCommand) {
    try {
        postMessageUseCase.handle(postMessageCommand);
    } catch (err) {
        thrownError = err;
    }
}
function thenPostedMessageShouldBe(expectedMessage: Message) {
    expect(expectedMessage).toEqual(message);
}
function thenErrorShouldBe(expectErrorClass: new () => Error) {
    expect(thrownError).toBeInstanceOf(expectErrorClass);
}