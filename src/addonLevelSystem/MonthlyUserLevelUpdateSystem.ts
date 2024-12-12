import { Client, type Snowflake, TextChannel } from 'discord.js';

export class MonthlyUserLevelUpdateSystem {
  private channelSendMessage: Promise<TextChannel>;
  private month: number;

  constructor(channelIdSendMessage: Snowflake, client: Client) {
    this.channelSendMessage = client.channels.fetch(
      channelIdSendMessage
    ) as Promise<TextChannel>;
    this.month = new Date().getMonth();
    this.initializeInterval();
  }

  private initializeInterval(): void {
    setInterval(this.handleInterval, 60 * 60 * 1000);
  }

  private async handleInterval(): Promise<void> {
    const currentMonth = new Date().getMonth();
    if (currentMonth !== this.month) {
      //await this.sendTopLevelUsers();
      this.updateUserLevel();
      this.updateDate();
    }
  }

  //private async sendTopLevelUsers() {
  //const userLevels = this.getUserLevelsJSON();
  //const channel = await this.channelSendMessage;
  //for (const levelName of levelNames) { //レベルごとに処理
  //channel.send(`## ${levelNameToLevelDisplayName(levelName)}ランキング`);
  //Object.entries(userLevels) //ユーザーごとに[ ユーザーID, レベルデータ ]という配列をつくり、それが並ぶ配列をつくる
  //.sort((a, b) => b[1].month[levelName] - a[1].month[levelName]) //月のlevelNameのレベルが高い順に並べる
  //.slice(0, 4) //上位5名を切り取り
  //.forEach(async (userData, index) => {
  //channel.send(`
  //## **${index + 1}位**: ${(await client.users.fetch(userData[0])).displayName}
  //記録: ${userData[1].month[levelName]}ポイント
  //{称号獲得メッセージ}
  //`
  //);
  //});
  //}
  //}

  private updateUserLevel(): void {}

  private updateDate(): void {}

  private getDate() {}

  private getUserLevelsJSON() {}
}
