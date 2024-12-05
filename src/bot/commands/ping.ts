import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandsBase from "./baseCommands";
import Bot from "../index";
import { isBlacklisted } from "../../utils/blacklist";  // Assure-toi que cette fonction est importée

// Définition des données de la commande
const commandData = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Shows the bot's ping on the discord api");

export class PingCommand extends CommandsBase {
  constructor(client: Bot) {
    super(client, commandData.toJSON()); // Appel du constructeur parent
  }

  // Méthode qui sera exécutée lorsque la commande sera lancée
  async run(interaction: CommandInteraction) {
    // Vérifier si l'utilisateur est blacklisté
    if (isBlacklisted(interaction.user.id)) {
      return interaction.reply({
        content: "You are blacklisted and cannot use this command.",
        ephemeral: true,  // Message visible uniquement pour l'utilisateur
      });
    }

    let i = await interaction.deferReply(); // Délai pour attendre la réponse

    // Mesure du temps de réponse du bot
    const ping = this.client.ws.ping;

    i.edit({
      content: `The bot's ping to the Discord API is ${ping} ms`,
    });
  }
}
