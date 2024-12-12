import { type Partialize } from "discord.js";

/** データがキャッシュされていなければfetchされたデータを返す */
export async function resolvePartialData(data: Partialize<any>) {
    if (data.partial) return await data.fetch();
    return data;
}