import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import CommandsBase from "./baseCommands";
import Bot from "../index";
import { bt } from "../../main";
import { isBlacklisted } from "../../utils/blacklist";

const commandData = new SlashCommandBuilder()
  .setName("shardstats")
  .setDescription("Displays shard statistics including servers and members count.");

export class ShardStatsCommand extends CommandsBase {
  constructor(client: Bot) {
    super(client, commandData.toJSON());
  }

  async run(interaction: CommandInteraction) {
    // Vérification si l'utilisateur est blacklisté
    if (isBlacklisted(interaction.user.id)) {
      return interaction.reply({
        content: "You are blacklisted and cannot use this command.",
        ephemeral: true,
      });
    }

    await interaction.deferReply(); // Déclare que le bot traite la commande

    const shardData = await interaction.client.shard?.broadcastEval(client => ({
      shardId: client.shard?.ids[0] || 0,
      guildCount: client.guilds.cache.size,
      memberCount: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
    }));

    if (!shardData) {
      return interaction.editReply({
        content: "Failed to retrieve shard data.",
      });
    }

    const totalServers = shardData.reduce((acc, shard) => acc + shard.guildCount, 0);
    const totalMembers = shardData.reduce((acc, shard) => acc + shard.memberCount, 0);

    const embed = new EmbedBuilder()
      .setTitle("📊 Shard Statistics")
      .setColor("Blue")
      .setDescription(`Statistics for all active shards.`)
      .addFields(
        ...shardData.map((shard) => ({
          name: `Shard ${shard.shardId}`,
          value: `Servers: **${shard.guildCount}**\nMembers: **${shard.memberCount}**`,
          inline: true,
        })),
        {
          name: "🌍 Total",
          value: `Servers: **${totalServers}**\nMembers: **${totalMembers}**`,
        }
      )
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
}
