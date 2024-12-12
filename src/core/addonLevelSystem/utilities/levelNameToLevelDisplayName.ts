export function levelNameToLevelDisplayName(levelName: string) {
    switch (levelName) {

        case 'bahavior':
            return 'ビヘイビア';

        case 'resource':
            return 'リソース';

        case 'scriptapi':
            return 'ScriptAPI';

        case 'item':
            return 'アイテム';

        case 'block':
            return 'ブロック';

        case 'entity':
            return 'エンティティ';

        case 'worldgen':
            return 'Biome, Feature等';

        case 'ui':
            return 'UI';

        case 'other':
            return 'その他';

        default:
            return levelName;

    }
}