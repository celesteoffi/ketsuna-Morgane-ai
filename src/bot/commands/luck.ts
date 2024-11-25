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

const commandData = new SlashCommandBuilder()
  .setName("luck")
  .setDescription("your luck")

export class GayCommand extends CommandsBase {
  constructor(client: Bot) {
    super(client, commandData.toJSON());
  }
 
 async run(interaction: CommandInteraction){
  let i = await interaction.deferReply(); 
  const randomPercentage = Math.floor(Math.random() * 101); 
  i.edit({
    content: bt.__({
      phrase: "Your luck and %s%",
      locale: interaction.locale,
    }, randomPercentage.toString()),
  });
  }
}