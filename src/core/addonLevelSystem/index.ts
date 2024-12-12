import { Client } from 'discord.js';
import { LevelUpEmoji } from './core/LevelUpEmoji';
import { MonthlyUserLevelUpdateSystem } from './core/MonthlyUserLevelUpdateSystem';
import { Database } from 'sqlite3';

export class AddonLevelSystem {
    private client?: Client;
    private userdb?: Database;

    constructor(private levelUpEmojis: LevelUpEmoji[]) {}

    initialize(client: Client, userdb: Database) {
        this.client = client;
        this.userdb = userdb;
        this.registerLevelUpEmojis();
    }

    private registerLevelUpEmojis(): void {
        if (this.client === undefined) {
            throw new Error(
                '絵文字を登録しようとしましたが、clientがundefinedでした'
            );
        }
        if (this.userdb === undefined) {
            throw new Error(
                '絵文字を登録しようとしましたが、userdbがundefinedでした'
            );
        }
        for (const levelUpEmoji of this.levelUpEmojis) {
            levelUpEmoji.register(this.client, this.userdb);
        }
    }
}
