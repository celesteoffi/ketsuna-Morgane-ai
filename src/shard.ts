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

// Variables pour suivre les états des shards
const shardStatuses: string[] = new Array(shardCount).fill("Unknown");

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

  // Commande `!shard`
  if (message.content === "!shard") {
    // Vérifie si l'utilisateur est whitelisté
    if (message.author.id !== OWNER_ID) {
      return message.reply("You do not have permission to use this command.");
    }

    // Collecte des informations sur les shards
    let shardDetails = "";
    shardStatuses.forEach((status, index) => {
      shardDetails += `**Shard ${index}:** ${status} - ${client.guilds.cache.filter((guild) => guild.shard.id === index).size} servers\n`;
    });

    // Création de l'embed
    const embed = new EmbedBuilder()
      .setTitle("Shard Information")
      .setDescription(shardDetails)
      .setColor("Purple");

    await message.reply({ embeds: [embed] });
  }

  // Commande `!shardinfo`
  if (message.content === "!shardinfo") {
    // Vérifie si l'utilisateur est whitelisté
    if (message.author.id !== OWNER_ID) {
      return message.reply("You do not have permission to use this command.");
    }

    // Collecte des informations détaillées sur les shards
    let shardDetails = "";
    shardStatuses.forEach((status, index) => {
      const guildCount = client.guilds.cache.filter((guild) => guild.shard.id === index).size;
      const memberCount = client.guilds.cache.filter((guild) => guild.shard.id === index).reduce((acc, guild) => acc + guild.memberCount, 0);
      shardDetails += `**Shard ${index}:** Status: ${status} | Servers: ${guildCount} | Members: ${memberCount}\n`;
    });

    // Création de l'embed
    const embed = new EmbedBuilder()
      .setTitle("Shard Detailed Information")
      .setDescription(shardDetails)
      .setColor("Purple");

    await message.reply({ embeds: [embed] });
  }

  // Commande `!statusshard`
  if (message.content === "!statusshard") {
    // Vérifie si l'utilisateur est whitelisté
    if (message.author.id !== OWNER_ID) {
      return message.reply("You do not have permission to use this command.");
    }

    // Création de l'embed pour le statut de chaque shard
    const embed = new EmbedBuilder()
      .setTitle("Shard Status")
      .setDescription(shardStatuses.map((status, index) => `**Shard ${index}:** ${status}`).join("\n"))
      .setColor("Purple");

    await message.reply({ embeds: [embed] });
  }

  // Commande `!srvshard`
  if (message.content === "!srvshard") {
    // Vérifie si l'utilisateur est whitelisté
    if (message.author.id !== OWNER_ID) {
      return message.reply("You do not have permission to use this command.");
    }

    // Collecte des serveurs gérés par chaque shard
    const serverList = await manager.broadcastEval(client => {
      return client.guilds.cache.map(guild => guild.name);
    });

    // Création d'un embed pour afficher les serveurs
    const embed = new EmbedBuilder()
      .setTitle("Servers Managed by Each Shard")
      .setColor("Purple");

    // Créer un tableau pour stocker les noms des shards et leurs serveurs
    let shardDetails = '';

    serverList.forEach((servers, index) => {
      const shardTitle = `**Shard ${index}**:`;
      const shardServers = servers.length > 0 ? servers.join(", ") : "No servers managed";
      shardDetails += `${shardTitle} ${shardServers}\n\n`;
    });

    embed.setDescription(shardDetails);

    await message.reply({ embeds: [embed] });
  }

  // Commande `!restartshard`
  if (message.content.startsWith("!restartshard")) {
    // Vérifie si l'utilisateur est whitelisté
    if (message.author.id !== OWNER_ID) {
      return message.reply("You do not have permission to use this command.");
    }

    const args = message.content.split(" ");
    const shardId = parseInt(args[1]);

    if (isNaN(shardId) || shardId < 0 || shardId >= shardCount) {
      return message.reply("Invalid shard ID.");
    }

    // Redémarrer le shard spécifique
    manager.shards.get(shardId)?.kill();
    manager.shards.get(shardId)?.spawn();

    await message.reply(`Shard ${shardId} has been restarted.`);
  }

  // Commande `!helpshard`
  if (message.content === "!helpshard") {
    const embed = new EmbedBuilder()
      .setTitle("Shard Commands Help")
      .setDescription("Here are the available shard commands:")

    embed.addFields(
      {
        name: "!shard",
        value: "Displays shard information, including status, number of servers.",
        inline: false,
      },
      {
        name: "!shardinfo",
        value: "Displays detailed shard information, including number of servers and members.",
        inline: false,
      },
      {
        name: "!statusshard",
        value: "Displays the status of all shards.",
        inline: false,
      },
      {
        name: "!srvshard",
        value: "Lists all the servers managed by each shard.",
        inline: false,
      },
    );

    // Ajouter des commandes whitelistées si l'utilisateur est le propriétaire
    if (message.author.id === OWNER_ID) {
      embed.addFields(
        {
          name: "!restartshard <id>",
          value: "Restarts a specific shard by its ID. Requires whitelist permission.",
          inline: false,
        },
        {
          name: "!srvshard",
          value: "Lists all the servers managed by each shard. Requires whitelist permission.",
          inline: false,
        },
      );
    } else {
      embed.addFields(
        {
          name: "Whitelist Command",
          value: "You need to be whitelisted (owner) to use some of these commands.",
          inline: false,
        }
      );
    }

    await message.reply({ embeds: [embed] });
  }
});

client.login(TOKEN).catch(console.error);
