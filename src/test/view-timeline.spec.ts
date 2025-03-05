import { InMemoryMessageRepository } from "../message-inMemory.repository";
import { Message } from "../post-message-usecase";
import { Timeline, ViewTimelineUseCase } from "../view-message-usecase";

describe("Feature: Viewing a personnal timeline", () => {
    let fixture: Fixture;
    beforeEach(() => {
        fixture = createFixture();
    });
    describe("Rule: Message are shown in reverse chronoligical order", () => {
        test("Alice can view the 2 messages, she published in her timeline", async () => {
            fixture.givenTheFollowingMessageExists([
                {
                    author: "Alice",
                    text: "My first message",
                    id: "message-1",
                    publishedAt: new Date("2023-02-07T16:28:00.000Z"),
                },
                {
                    author: "Bob",
                    text: "Hi it's Bob",
                    id: "message-2",
                    publishedAt: new Date("2023-02-07T16:29:00.000Z"),
                },
                {
                    author: "Alice",
                    text: "How are you all ?",
                    id: "message-3",
                    publishedAt: new Date("2023-02-07T16:30:00.000Z"),
                },
            ]);
            fixture.givenNowIs(new Date("2023-02-07T16:30:00.000Z"));
            await fixture.whenUserSeesTheTileLineOf("Alice");

            fixture.thenUserShouldSee([
                {
                    author: "Alice",
                    text: "How are you all ?",
                    publicationTime: "1 minute ago",
                },
                {
                    author: "Alice",
                    text: "My first message",
                    publicationTime: "2 minutes ago",
                },
            ]);
        });
    });
});


const createFixture = () => {
    let timeline: Timeline[];
    const messageRepository = new InMemoryMessageRepository();
    const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository);
    return {
        givenTheFollowingMessageExists(message: Message[]) {
            messageRepository.giveExistingMessages(message);
        },
        givenNowIs(now: Date) { },
        async whenUserSeesTheTileLineOf(user: string) {
            timeline = await viewTimelineUseCase.handle({ user });
        },
        thenUserShouldSee(expectedTimeline: Timeline[]) {
            expect(timeline).toEqual(expectedTimeline);
        }
    };
};
export type Fixture = ReturnType<typeof createFixture>;
