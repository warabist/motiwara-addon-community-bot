import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';
import { Database } from 'sqlite3';
import { AddonLevelSystem } from './addonLevelSystem';

export class Bot {
    private readonly client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent,
        ],
        partials: [
            Partials.Message,
            Partials.Channel,
            Partials.Reaction,
            Partials.User,
        ],
    });

    private readonly userdb = new Database('user.db');

    constructor(private readonly addonLevelSystem: AddonLevelSystem) {}

    start(): void {
        config();
        this.addonLevelSystem.initialize(this.client, this.userdb);
        this.client.once(Events.ClientReady, () => {
            console.log('Bot起動');
        });
        this.client.login(process.env.TOKEN);
    }
}
