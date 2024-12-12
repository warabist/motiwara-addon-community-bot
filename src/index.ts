import { Bot } from './core';
import { AddonLevelSystem } from './core/addonLevelSystem';
import { LevelUpEmoji } from './core/addonLevelSystem/core/LevelUpEmoji';

new Bot(
    new AddonLevelSystem([
        new LevelUpEmoji('best_answer', 2),
        new LevelUpEmoji('level_up', 1),
    ])
).start();
