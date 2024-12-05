import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import CommandsBase from "./baseCommands";
import Bot from "../index";
import { isBlacklisted } from "../../utils/blacklist";  // Assure-toi que cette fonction est importée

const commandData = new SlashCommandBuilder()
  .setName("botinfo")
  .setDescription("Displays detailed information about the bot.");

export class BotInfoCommand extends CommandsBase {
  constructor(client: Bot) {
    super(client, commandData.toJSON());
  }

  async run(interaction: CommandInteraction) {
    // Vérifier si l'utilisateur est blacklisté
    if (isBlacklisted(interaction.user.id)) {
      return interaction.reply({
        content: "You are blacklisted and cannot use this command.",
        ephemeral: true,  // Message visible uniquement pour l'utilisateur
      });
    }

    const bot = interaction.client.user!;
    const botCreatedAt = bot.createdAt.toDateString();
    const uptime = Math.floor(interaction.client.uptime! / 1000);
    const serverCount = interaction.client.guilds.cache.size;
    const totalUsers = interaction.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const totalChannels = interaction.client.channels.cache.size;
    const totalRoles = interaction.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.roles.cache.size,
      0
    );
    const totalEmojis = interaction.client.emojis.cache.size;
    const boostCount = interaction.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.premiumSubscriptionCount!,
      0
    );

    const developerName = "Céleste";
    const developerId = "1185603511577235572";
    const developerCreatedAt = "16 déc. 2023"; // Remplacez par la date réelle si connue

    const shardId = interaction.guild?.shardId ?? 0; // Identifiant de la shard où la commande est exécutée

    const hosting = "Célesta Games";
    const nodeVersion = process.version;
    const programmingLanguage = "TypeScript";
    const ping = Math.round(interaction.client.ws.ping);

    const embed = new EmbedBuilder()
      .setTitle("📊 Bot Information")
      .setColor("Blurple")
      .addFields(
        {
          name: "👤 Developer Information",
          value: `**Name:** ${developerName}\n**ID:** ${developerId}\n**Account Created:** ${developerCreatedAt}`,
        },
        {
          name: "📋 General Information",
          value: `**Bot Name:** ${bot.username}\n**ID:** ${bot.id}\n**Shard ID:** ${shardId}\n**Uptime:** ${uptime}s`,
        },
        {
          name: "🔧 Complementary Information",
          value: `**Servers:** ${serverCount}\n**Users:** ${totalUsers}\n**Roles:** ${totalRoles}\n**Channels:** ${totalChannels}\n**Boosts:** ${boostCount}\n**Emojis:** ${totalEmojis}`,
        },
        {
          name: "💻 Technical Information",
          value: `**Hosting:** ${hosting}\n**Programming Language:** ${programmingLanguage}\n**Bot Ping:** ${ping}ms`,
        }
      )
      .setThumbnail(bot.displayAvatarURL())
      .setTimestamp()
      .setFooter({ text: "Requested by " + interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
}
