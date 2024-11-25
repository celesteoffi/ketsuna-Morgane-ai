import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsBase from "./baseCommands";
import Bot from "../index";
import { bt } from "../../main";

const commandData = new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("Show your avatar");

export class AvatarCommand extends CommandsBase {
  constructor(client: Bot) {
    super(client, commandData.toJSON());
  }

  async run(interaction: CommandInteraction) {
    const i = await interaction.deferReply();

    // Affiche l'avatar de l'utilisateur qui a exécuté la commande
    i.edit({
      content: bt.__({
        phrase: "Your avatar :",
        locale: interaction.locale,
      }),
      embeds: [{
        image: {
          url: interaction.user.displayAvatarURL(),
        },
      }],
    });
  }
}
