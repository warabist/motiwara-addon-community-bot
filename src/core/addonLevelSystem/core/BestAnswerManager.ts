import { EmbedBuilder, Message, type ForumThreadChannel } from 'discord.js';
import { getRecentBotMessage } from '../../../utilities/getRecentBotMessage';

export class BestAnswerManager {
    constructor(private resolvedTagId: string) {}

    /** answerMessageをベストアンサーとして固定 */
    setBestAnswer(answerMessage: Message, thread: ForumThreadChannel): void {
        BestAnswerManager.sendMessageWithBestAnswer(
            answerMessage,
            answerMessage.channel as ForumThreadChannel
        );
        thread.setAppliedTags([this.resolvedTagId]);
        thread.setLocked(true);
    }

    /** threadのベストアンサーを取り消し */
    removeSettingBestAnswer(thread: ForumThreadChannel): void {
        getRecentBotMessage(thread)?.then((message) => message?.delete());
        thread.setAppliedTags([]);
        thread.setLocked(false);
    }

    private static sendMessageWithBestAnswer(
        answerMessage: Message,
        thread: ForumThreadChannel
    ) {
        const embed = new EmbedBuilder({
            fields: [
                {
                    name: '',
                    value: `**${answerMessage.author.displayName}さんの**\n\n${answerMessage.content.length >= 250 ? answerMessage.content.substring(0, 249) + '(以下省略)' : answerMessage.content}\n\n**がベストアンサーに選ばれました!**`,
                },
            ],
        }).setColor('Green');

        thread.send({ embeds: [embed] });
    }
}
