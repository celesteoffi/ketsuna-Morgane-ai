import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsBase from "./baseCommands";
import Bot from "../index";

const commandData = new SlashCommandBuilder()
  .setName("botinfo")
  .setDescription("Shows information about the bot");

export class BotInfoCommand extends CommandsBase {
  constructor(client: Bot) {
    super(client, commandData.toJSON());
  }

  async run(interaction: CommandInteraction) {
    const bot = interaction.client.user;
    const createdAt = bot?.createdAt.toDateString();
    const uptime = Math.floor(interaction.client.uptime! / 1000);
    const serverCount = interaction.client.guilds.cache.size;

    await interaction.reply({
      content: `Bot Info:
      - Name: ${bot?.username}
      - ID: ${bot?.id}
      - Created on: ${createdAt}
      - Uptime: ${uptime}s
      - Servers: ${serverCount}`,
    });
  }
}
