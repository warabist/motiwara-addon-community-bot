import { Bot } from './Bot';
import { AddonLevelSystem } from './addonLevelSystem';
import { LevelUpEmoji } from './addonLevelSystem/LevelUpEmoji';

new Bot(
  new AddonLevelSystem([
    new LevelUpEmoji('best_answer', 2),
    new LevelUpEmoji('level_up', 1),
  ])
).start();
