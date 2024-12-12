/** チャンネルIDから上がるレベルの名前を引き出す */
export function channelIdToLevelName(id: string) {
    switch (id) {

        case '1284764646917537843':
            return 'item';

        case '1284764725879504896':
            return 'block';

        default:
            return id;

    }
}