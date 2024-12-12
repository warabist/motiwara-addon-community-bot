import { BaseChannel, Collection, Message } from "discord.js";

interface HasMessages {
    messages: {
        fetch(options: { limit: number }): Promise<Collection<string, Message>>;
    }
}

/** 直近五件にある、ボットが送信したメッセージを一件取得する */
export async function getRecentBotMessage<T extends BaseChannel & HasMessages>(channel: T) {
    return (await channel.messages.fetch({ limit: 5 })).find(message =>
        message.author.id === process.env.BOT_ID
    );
}