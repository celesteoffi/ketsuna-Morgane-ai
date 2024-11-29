import { ShardingManager, Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

// Vérification des variables d'environnement
const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_COUNT = parseInt(process.env.GUILD_COUNT || "0", 10);
const SERVERS_PER_SHARD = parseInt(process.env.SERVERS_PER_SHARD || "50", 10);
const OWNER_ID = process.env.OWNER_ID;

if (!TOKEN) {
  console.error("The bot's token is not defined. Please check your .env file.");
  process.exit(1);
}

if (!GUILD_COUNT || !SERVERS_PER_SHARD) {
  console.error(
    "The variables GUILD_COUNT or SERVERS_PER_SHARD are not correctly defined. Please check your .env file."
  );
  process.exit(1);
}

if (!OWNER_ID) {
  console.error("The OWNER_ID variable is not defined. Please check your .env file.");
  process.exit(1);
}

// Calculer dynamiquement le nombre de shards nécessaires
const shardCount = Math.max(1, Math.ceil(GUILD_COUNT / SERVERS_PER_SHARD));
console.log(`[ShardManager] Calculated number of shards: ${shardCount} shard(s) needed.`);

// Variables pour suivre les états des shards et la whitelist
const shardStatuses: string[] = new Array(shardCount).fill("Unknown");
const whitelist: Set<string> = new Set();  // Stocke les utilisateurs whitelistés

// Initialisation du ShardingManager
const manager = new ShardingManager("./dist/main.js", {
  token: TOKEN,
  totalShards: shardCount,
  respawn: true,
});

// Suivi des événements des shards pour mettre à jour les statuts
manager.on("shardCreate", (shard) => {
  console.log(`[ShardManager] Shard ${shard.id} has been created.`);
  shardStatuses[shard.id] = "Launching";

  shard.once("ready", () => {
    shardStatuses[shard.id] = "Online";
  });

  shard.once("disconnect", () => {
    shardStatuses[shard.id] = "Disconnected";
  });

  shard.once("death", () => {
    shardStatuses[shard.id] = "Dead";
  });
});

// Lancer les shards
manager
  .spawn({ delay: 5500, timeout: 30000 })
  .then(() => console.log("[ShardManager] All shards have been launched."))
  .catch((err) => console.error("[ShardManager] Error while launching shards:", err));

// Client pour gérer les commandes
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once("ready", () => {
  console.log(`[Bot] Logged in as ${client.user?.tag}.`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Commande `!help` - Affiche la liste des commandes disponibles
  if (message.content === "!shhelp") {
    const embed = new EmbedBuilder()
      .setTitle("Available Commands")
      .setColor("Green")
      .setDescription(
        "Here are the commands you can use:\n\n" +
        "**!addwhitelist <user_id>**: Adds a user to the whitelist (Owner only).\n" +
        "**!removewhitelist <user_id>**: Removes a user from the whitelist (Owner only).\n" +
        "**!listwhitelist**: Lists all users in the whitelist (Owner only).\n" +
        "**!restartshard <id>**: Restarts a specific shard (whitelisted users only).\n" +
        "**!shardstart**: Starts a new shard (whitelisted users only).\n" +
        "**!shard**: Displays information about all shards.\n" +
        "**!srvshard**: Lists servers managed by each shard (Owner only)."
      )
      .setFooter({ text: "Use each command with the correct format." });

    message.reply({ embeds: [embed] });
  }

  // Commande `!addwhitelist <user_id>` - Ajouter un utilisateur à la whitelist
  if (message.content.startsWith("!addwhitelist")) {
    const args = message.content.split(" ");
    if (args.length !== 2 || !args[1].match(/\d{18}/)) {
      return message.reply("Usage: `!addwhitelist <user_id>` where `<user_id>` is the ID of the user to whitelist.");
    }

    const userId = args[1];
    if (message.author.id !== OWNER_ID) {
      return message.reply("You do not have permission to use this command.");
    }

    whitelist.add(userId);
    return message.reply(`${userId} has been added to the whitelist.`);
  }

  // Commande `!removewhitelist <user_id>` - Retirer un utilisateur de la whitelist
  if (message.content.startsWith("!removewhitelist")) {
    const args = message.content.split(" ");
    if (args.length !== 2 || !args[1].match(/\d{18}/)) {
      return message.reply("Usage: `!removewhitelist <user_id>` where `<user_id>` is the ID of the user to remove.");
    }

    const userId = args[1];
    if (message.author.id !== OWNER_ID) {
      return message.reply("You do not have permission to use this command.");
    }

    whitelist.delete(userId);
    return message.reply(`${userId} has been removed from the whitelist.`);
  }

  // Commande `!listwhitelist` - Liste des utilisateurs whitelistés
  if (message.content === "!listwhitelist") {
    if (message.author.id !== OWNER_ID) {
      return message.reply("You do not have permission to use this command.");
    }

    if (whitelist.size === 0) {
      return message.reply("The whitelist is empty.");
    }

    const whitelistList = Array.from(whitelist).join("\n");
    return message.reply(`Users in the whitelist:\n${whitelistList}`);
  }

  // Commande `!restartshard <id>` - Redémarrer un shard spécifique (requiert la whitelist)
  if (message.content.startsWith("!restartshard")) {
    const args = message.content.split(" ");
    if (args.length !== 2 || isNaN(Number(args[1]))) {
      return message.reply("Usage: `!restartshard <id>` where `<id>` is the ID of the shard to restart.");
    }

    const shardId = parseInt(args[1], 10);
    if (shardId < 0 || shardId >= shardCount) {
      return message.reply("The shard ID is invalid.");
    }

    // Vérification de la whitelist
    if (!whitelist.has(message.author.id)) {
      return message.reply("You do not have permission to restart shards.");
    }

    try {
      await manager.shards.get(shardId)?.respawn();
      shardStatuses[shardId] = "Restarting";
      message.reply(`Shard ${shardId} has been successfully restarted.`);
    } catch (error) {
      console.error(`Error while restarting shard ${shardId}:`, error);
      message.reply(`Error while restarting shard ${shardId}.`);
    }
  }

// Commande `!shardstart` - Lancer une nouvelle shard
if (message.content === "!shardstart") {
  // Vérification de la whitelist
  if (message.author.id !== OWNER_ID) {
    return message.reply("You do not have permission to use this command.");
  }

  try {
    // Vérification du nombre actuel de shards
    const currentShardCount = shardStatuses.length;
    const newShardId = currentShardCount; // ID de la nouvelle shard est basé sur le nombre actuel de shards

    // Si le nombre de shards déjà lancés est égal à celui calculé initialement, il faut redémarrer ou ajouter
    if (currentShardCount < shardCount) {
      shardStatuses.push("Launching"); // Marquer la nouvelle shard comme en cours de lancement

      // Lancer la nouvelle shard
      await manager.spawn({ delay: 5500, timeout: 30000 });

      // Mettre à jour le statut de la shard
      shardStatuses[newShardId] = "Online";

      message.reply(`Shard ${newShardId} has been successfully started.`);
    } else {
      message.reply("The maximum number of shards has already been reached.");
    }
  } catch (error) {
    console.error("Error while starting a new shard:", error);
    message.reply("Error while starting a new shard.");
  }
}



  // Commande `!shard` - Affiche les informations sur les shards
  if (message.content === "!shard") {
    const shardInfo = await manager.broadcastEval(client => ({
      id: client.shard?.ids[0],
      guilds: client.guilds.cache.size,
      members: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
    }));

    const embed = new EmbedBuilder()
      .setTitle("Shard Information")
      .setColor("Blue");

    shardInfo.forEach(info => {
      embed.addFields([
        {
          name: `Shard ${info.id}`,
          value: `Status: ${shardStatuses[info.id] || "Unknown"}\nServers: ${info.guilds}\nMembers: ${info.members}`,
        },
      ]);
    });

    message.reply({ embeds: [embed] });
  }

  // Commande `!srvshard` - Liste des serveurs gérés par chaque shard
  if (message.content === "!srvshard") {
    if (message.author.id !== OWNER_ID) {
      return message.reply("You do not have permission to use this command.");
    }

    const shardServerCount = await manager.broadcastEval(client => client.guilds.cache.size);

    let response = "Servers managed by each shard:\n";
    shardServerCount.forEach((count, idx) => {
      response += `Shard ${idx}: ${count} server(s)\n`;
    });

    message.reply(response);
  }
});

// Connexion du bot
client.login(TOKEN).catch((err) => {
  console.error("[Bot] Login failed:", err);
});
