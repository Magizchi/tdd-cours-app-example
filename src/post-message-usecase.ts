export type PostMessageCommand = { id: string; author: string; text: string; };
export type Message = { id: string; author: string; text: string; publishedAt: Date; };

export interface MessageRepository {
    save(message: Message): void;
}

export interface DateProvider {
    getNow(): Date;
}

export class PostMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider
    ) { }
    handle(postMessageCommand: PostMessageCommand) {
        this.messageRepository.save({
            id: postMessageCommand.id,
            text: postMessageCommand.text,
            author: postMessageCommand.author,
            publishedAt: this.dateProvider.getNow()
        });
    }
}