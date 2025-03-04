import { InMemoryMessageRepository } from "../message-inMemory.repository";
import { DateProvider, EmptyMessageError, Message, MessageRepository, MessageTooLongError, PostMessageCommand, PostMessageUseCase } from "../post-message-usecase";

describe("Feature: Posting a message", () => {
    let fixture: Fixture;
    beforeEach(() => {
        fixture = createFixture();
    });
    describe('Rule: A message can contain a maximum of 280 characters', () => {
        test("Alice can post a message on her timeline", async () => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessages({
                id: "message-id",
                text: "Hello world",
                author: "Alice"
            });
            fixture.thenPostedMessageShouldBe({
                id: "message-id",
                text: "Hello world",
                author: "Alice",
                publishedAt: new Date("2023-01-19T19:00:00.000Z")
            });
        });

        test("Alice cannot post a messsage with more than 280 character", async () => {
            const textWithLengthOf281 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec semper lacus eu interdum ultrices. Vestibulum pharetra magna turpis, in consectetur nulla mollis ut. Suspendisse finibus dapibus feugiat. Proin quis leo vitae dolor tempus blandit vitae vel neque. Pellentesque aliquam. ";
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessages({
                id: "message-id",
                text: textWithLengthOf281,
                author: "Alice"
            });
            fixture.thenErrorShouldBe(MessageTooLongError);
        });
    });
    describe('Rule: Message cannot be emppty', () => {
        test("Alice cannot post empty message", async () => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessages({
                id: "message-id",
                text: "",
                author: "Alice"
            });
            fixture.thenErrorShouldBe(EmptyMessageError);
        });
        test("Alice cannot post an message with only whitespaces", async () => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessages({
                id: "message-id",
                text: "  ",
                author: "Alice"
            });
            fixture.thenErrorShouldBe(EmptyMessageError);
        });
    });
});

class StubDateProvider implements DateProvider {
    now: Date;
    getNow(): Date {
        return this.now;
    }
}
type Fixture = ReturnType<typeof createFixture>;
const createFixture = () => {
    const dateProvider = new StubDateProvider();
    const messageRepository = new InMemoryMessageRepository();
    const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider);
    let thrownError: Error;
    return {
        givenNowIs(now: Date) {
            dateProvider.now = now;
        },
        async whenUserPostsAMessages(postMessageCommand: PostMessageCommand) {
            try {
                await postMessageUseCase.handle(postMessageCommand);
            } catch (err) {
                thrownError = err;
            }
        },
        thenPostedMessageShouldBe(expectedMessage: Message) {
            expect(expectedMessage).toEqual(messageRepository.message);
        },
        thenErrorShouldBe(expectErrorClass: new () => Error) {
            expect(thrownError).toBeInstanceOf(expectErrorClass);
        }
    };
};