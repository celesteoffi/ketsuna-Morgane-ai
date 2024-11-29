import dotenv from "dotenv";
import Bot from "./bot"; // Assure-toi que la classe Bot est bien définie pour gérer ton bot
import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { I18n } from "i18n";
import { Client, EmbedBuilder } from "discord.js";  // Importation de discord.js pour la gestion des commandes

dotenv.config();
export const bot = new Bot();
const app = fastify();
const libsql = createClient({
  url: `file:prisma/local.db`,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });
prisma
  .$connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Error while connecting to database: ", err);
    process.exit(1);
  });
bot.database = prisma;
bot.init();

export const bt = new I18n();
bt.configure({
  defaultLocale: "en-GB",
  directory: "./locales/bot_i18n",
  autoReload: false,
  updateFiles: false,
});

// Commande pour obtenir l'ID du shard actuel
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent"] });

client.once("ready", () => {
  console.log(`[Bot] Logged in as ${client.user?.tag}.`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Commande !shardinfsrv
  if (message.content === "!shardinfsrv") {
    // Vérifier si le bot utilise le sharding
    if (message.client.shard) {
      const shardId = message.client.shard.ids[0];  // Utiliser ids[0] pour obtenir l'ID du shard actuel

      // Création de l'embed avec le numéro du shard
      const embed = new EmbedBuilder()
        .setTitle("Shard Information")
        .setColor("Blue")
        .setDescription(`This command was executed on shard **${shardId}**.`);

      await message.reply({ embeds: [embed] });
    } else {
      await message.reply("The bot is not using sharding.");
    }
  }

  // Ajoute d'autres commandes ici si nécessaire
});

client.login(process.env.DISCORD_TOKEN).catch(console.error);
