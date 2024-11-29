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
          inline: true,
        },
      ]);
    });

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

    serverList.forEach((servers, index) => {
      embed.addFields({
        name: `Shard ${index}`,
        value: servers.length > 0 ? servers.join("\n") : "No servers managed",
        inline: false,
      });
    });

    await message.reply({ embeds: [embed] });
  }

  // Commande `!shardinfo`
  if (message.content === "!shardinfo") {
    const shardInfo = await manager.broadcastEval(client => ({
      id: client.shard?.ids[0],
      guilds: client.guilds.cache.size,
      members: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
    }));

    const embed = new EmbedBuilder()
      .setTitle("Detailed Shard Information")
      .setColor("Green");

    shardInfo.forEach(info => {
      embed.addFields([
        {
          name: `Shard ${info.id}`,
          value: `Servers: ${info.guilds}\nMembers: ${info.members}`,
          inline: true,
        },
      ]);
    });

    await message.reply({ embeds: [embed] });
  }

  // Commande `!statusshard`
  if (message.content === "!statusshard") {
    const embed = new EmbedBuilder()
      .setTitle("Shard Status")
      .setColor("Yellow");

    shardStatuses.forEach((status, id) => {
      embed.addFields([{ name: `Shard ${id}`, value: `Status: ${status}`, inline: true }]);
    });

    await message.reply({ embeds: [embed] });
  }

  // Commande `!restartshard <id>`
  if (message.content.startsWith("!restartshard")) {
    const args = message.content.split(" ");
    if (args.length !== 2 || isNaN(Number(args[1]))) {
      return message.reply("Usage: `!restartshard <id>` where `<id>` is the ID of the shard to restart.");
    }

    const shardId = parseInt(args[1], 10);
    if (shardId < 0 || shardId >= shardCount) {
      return message.reply("The shard ID is invalid.");
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

  // Commande `!helpshard`
  if (message.content === "!helpshard") {
    const embed = new EmbedBuilder()
      .setTitle("Shard Commands Help")
      .setDescription("Here are the available shard commands:")

    embed.addFields(
      {
        name: "!shard",
        value: "Displays shard information, including status, number of servers, and members.",
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
