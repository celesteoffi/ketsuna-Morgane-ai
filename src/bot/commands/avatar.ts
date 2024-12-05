import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsBase from "./baseCommands";
import Bot from "../index";
import { bt } from "../../main";
import { isBlacklisted } from "../../utils/blacklist";  // Importer la fonction de vérification de blacklist

// Commande pour afficher l'avatar de l'utilisateur
const commandData = new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("Show your avatar");

export class AvatarCommand extends CommandsBase {
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

    // Si l'utilisateur n'est pas blacklisté, continuer avec la commande
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
