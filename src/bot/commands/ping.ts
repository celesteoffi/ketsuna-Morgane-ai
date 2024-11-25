import {
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import CommandsBase from "./baseCommands";
import Bot from "../index";
import { bt } from "../../main";

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
    let i = await interaction.deferReply(); // Délai pour attendre la réponse

    // Mesure du temps de réponse du bot
    const ping = this.client.ws.ping;

    i.edit({
      content: bt.__({
        phrase: "The bot's ping to the discord api is %s ms",
        locale: interaction.locale,
      }, ping.toString()), // Envoie le message avec le ping
    });
  }
}
