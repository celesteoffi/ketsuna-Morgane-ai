import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import https from "https";
import CommandsBase from "./baseCommands";
import Bot from "../index";

const commandData = new SlashCommandBuilder()
  .setName("aiinfo")
  .setDescription("AI performance information");

export class AIInfoCommand extends CommandsBase {
  constructor(client: Bot) {
    super(client, commandData.toJSON());
  }

  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const fetchAPI = (url: string): Promise<any> =>
      new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(new Error("Failed to parse JSON"));
            }
          });
        }).on("error", (err) => {
          reject(err);
        });
      });

    const updateEmbed = async () => {
      try {
        const data = await fetchAPI("https://stablehorde.net/api/v2/status/performance");

        const embed = new EmbedBuilder()
          .setTitle("AI Performance Information (Auto-updating)")
          .setColor(0x00ff00)
          .addFields(
            { name: "Queued Requests", value: data.queued_requests.toString(), inline: true },
            { name: "Number of active Image workers", value: data.worker_count.toString(), inline: true },
            { name: "Number of active Text Workers", value: data.text_worker_count.toString(), inline: true }
        )
          .setFooter({ text: "Data provided by Stable Horde API" })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error("Error fetching AI info:", error);
        await interaction.editReply({
          content: "Unable to fetch AI information. Please try again later.",
        });
      }
    };

    // Démarrer l'actualisation permanente
    updateEmbed(); // Mise à jour initiale
    setInterval(updateEmbed, 8000); // Mise à jour toutes les 8 secondes
  }
}
