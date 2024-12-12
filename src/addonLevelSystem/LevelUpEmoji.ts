import {
    Events,
    MessageReaction,
    Message,
    type PartialMessageReaction,
    User,
    type PartialUser,
    ForumChannel,
    type ForumThreadChannel,
    Client,
} from 'discord.js';
import { resolvePartialData } from '../utilities/resolvePartialData';
import { getRecentBotMessage } from '../utilities/getRecentBotMessage';
import { BestAnswerManager } from './manager/BestAnswerManager';
import { Database } from 'sqlite3';
import { levels } from './constants/levels';

/** レベルアップに使う絵文字 */
export class LevelUpEmoji {
    private client?: Client;
    private userdb?: Database;
    private isBestAnswer: boolean;

    constructor(
        private emojiName: 'best_answer' | string,
        private levelUpAmount: number
    ) {
        this.isBestAnswer = emojiName === 'best_answer';
    }

    register(client: Client, userdb: Database): void {
        try {
            this.client = client;
            this.userdb = userdb;
            this.initializeEventListeners();
            console.log(
                this.emojiName + 'としてレベルアップ絵文字を登録しました'
            );
        } catch (err) {
            console.error(
                this.emojiName + 'のレベルアップ絵文字登録を失敗しました'
            );
            throw err;
        }
    }

    private initializeEventListeners(): void {
        if (this.client === undefined) {
            throw new Error(
                `clientがundefinedだったため、${this.emojiName}の登録に失敗しました`
            );
        }
        this.client.on(Events.MessageReactionAdd, (reaction, user) => {
            this.handleReactionChange('add', reaction, user);
        });
        this.client.on(Events.MessageReactionRemove, (reaction, user) => {
            this.handleReactionChange('remove', reaction, user);
        });
    }

    private async handleReactionChange(
        action: 'add' | 'remove',
        reaction: MessageReaction | PartialMessageReaction,
        user: User | PartialUser
    ): Promise<void> {
        try {
            const resolvedReaction = (await resolvePartialData(
                reaction
            )) as MessageReaction;
            const resolvedUser = (await resolvePartialData(user)) as User;
            const resolvedMessage = (await resolvePartialData(
                resolvedReaction.message
            )) as Message;
            const thread = resolvedMessage.channel as ForumThreadChannel;
            const threadParent = thread.parent as ForumChannel;
            const resolvedTagId = threadParent.availableTags[0].id;
            const bestAnswerManager = new BestAnswerManager(resolvedTagId);

            if (this.shouldSkipProcessing(resolvedReaction, resolvedUser)) {
                return;
            }

            if (
                action === 'add' &&
                (await getRecentBotMessage(thread)) !== undefined &&
                this.isBestAnswer
            ) {
                resolvedReaction.remove();
                return;
            }

            this.adjustLevel(
                resolvedMessage.author,
                this.levelUpAmount,
                thread
            );
            if (this.isBestAnswer) {
                if (action === 'add') {
                    bestAnswerManager.setBestAnswer(resolvedMessage, thread);
                } else if (action === 'remove') {
                    bestAnswerManager.removeSettingBestAnswer(thread);
                }
            }
        } catch (err) {
            console.error(
                `リアクション${action === 'add' ? '追加' : '削除'}の処理中にエラーが発生しました:`
            );
            throw err;
        }
    }

    /** ユーザーのレベルを変更する */
    private adjustLevel(
        author: User,
        amount: number,
        thread: ForumThreadChannel
    ): void {
        const levelName =
            levels.find((level) => {
                return level.channelId === thread.parentId;
            })?.name ?? thread.parentId;

        //ここでレベル更新処理を入れる予定

        console.log(
            author.displayName +
                'の' +
                levelName +
                'レベルを ' +
                this.levelUpAmount +
                (amount > 0 ? ' 上げました' : ' 下げました')
        );
    }

    /** レベル管理処理を飛ばすかを返す */
    private shouldSkipProcessing(
        reaction: MessageReaction,
        user: User
    ): boolean {
        const channel = reaction.message.channel;
        if (!channel.isThread()) return true;

        const isBot = user.bot || reaction.message.author?.bot;
        const isNotLevelUpEmoji = reaction.emoji?.name !== this.emojiName;
        const isNotQuestionChannelParent =
            levels.find((level) => {
                return level.channelId === channel.parentId;
            }) === undefined;
        const isOwner = user.id === channel.ownerId;

        //どれかがtrueならば、処理は飛ばされる
        return (
            isBot || isNotLevelUpEmoji || isNotQuestionChannelParent || isOwner
        );
    }
}
