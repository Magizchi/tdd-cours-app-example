import { Message, MessageRepository } from "./post-message-usecase";

export class InMemoryMessageRepository implements MessageRepository {

    messages = new Map<string, Message>;
    save(msg: Message): Promise<void> {
        this._save(msg);
        return Promise.resolve();
    }

    getMessageById(messageId: string) {
        return this.messages.get(messageId);
    }

    giveExistingMessages(messages: Message[]) {
        messages.forEach(this._save.bind(this));
    }

    getAllOfUser(user: string): Promise<Message[]> {
        return Promise.resolve([...this.messages.values()].filter(msg => msg.author === user));
    }

    private _save(msg: Message) {
        this.messages.set(msg.id, msg);
    }
}