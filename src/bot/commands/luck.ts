import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import CommandsBase from "./baseCommands";
import Bot from "../index";
import { bt } from "../../main";
import { isBlacklisted } from "../../utils/blacklist";  // Assure-toi que cette fonction est importée depuis un fichier utils ou un autre fichier

const commandData = new SlashCommandBuilder()
  .setName("luck")
  .setDescription("your luck");

export class luckCommand extends CommandsBase {
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
    let i = await interaction.deferReply();
    const randomPercentage = Math.floor(Math.random() * 101);

    i.edit({
      content: bt.__({
        phrase: "Your luck is %s%",
        locale: interaction.locale,
      }, randomPercentage.toString()),
    });
  }
}
