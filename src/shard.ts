import { ShardingManager, Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

// Vérification du token
const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error("Le token du bot n'est pas défini. Vérifiez votre fichier .env.");
  process.exit(1);
}

// Calculer dynamiquement le nombre de guildes gérées par shard
const guildCount = parseInt(process.env.GUILD_COUNT || "0", 10); // Si la variable n'est pas définie, on la met à 0
const shardCount = Math.max(1, Math.ceil(guildCount / 50)); // Calcul du nombre de shards (1000 guildes par shard)

// Variables pour suivre les états des shards
const shardStatuses: string[] = new Array(shardCount).fill("Inconnu");

// Initialisation du ShardingManager
const manager = new ShardingManager("./dist/main.js", {
  token: TOKEN,
  totalShards: shardCount, // Utiliser le nombre calculé de shards
  respawn: true, // Relancer automatiquement un shard s'il plante
});

// Fonction pour obtenir les informations sur les shards
const getShardInfo = () => {
  const shardInfo: string[] = [];
  for (let i = 0; i < shardCount; i++) {
    shardInfo.push(`Shard ${i}: Status - ${shardStatuses[i]}`);
  }
  return shardInfo.join("\n");
};

// Fonction pour obtenir le statut des shards
const getShardStatus = () => {
  return shardStatuses.join("\n");
};

// Initialisation du client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], // Ajout de MessageContent pour accéder aux contenus des messages
});

// Quand le client est prêt
client.once("ready", () => {
  console.log(`[Client] ${client.user?.tag} est connecté et prêt.`);
});

// Gestion des messages
client.on("messageCreate", async (message) => {
  // Log des messages reçus
  //console.log(`Message reçu: ${message.content}`);

  // Ignorer les messages du bot lui-même
  if (message.author.bot) return;

  // Commande `!shardinfo`
  if (message.content === "!shardinfo") {
    console.log('Commande !shardinfo reçue');
    const shardInfo = getShardInfo();
    await message.reply(`Informations sur les Shards:\n${shardInfo}`);
  }

  // Commande `!shardstatus`
  if (message.content === "!shardstatus") {
    console.log('Commande !shardstatus reçue');
    const shardStatus = getShardStatus();
    await message.reply(`Statuts des Shards:\n${shardStatus}`);
  }

  // Commande `!shardcount`
  if (message.content === "!shardcount") {
    console.log('Commande !shardcount reçue');
    await message.reply(`Le bot utilise un total de ${shardCount} shard(s).`);
  }

  // Commande `!shard`
  if (message.content === "!!!!shard") {
    const shardId = message.guild?.shardId; // Récupérer l'ID du shard du serveur actuel
    if (shardId !== undefined) {
      // Utiliser broadcastEval pour récupérer les guildes du shard
      manager.broadcastEval(function () { // Utiliser la fonction anonyme ici pour accéder à `this`
        if (this.readyAt) { // Vérifier que le client est prêt
          const guildCount = this.guilds.cache.size;
          return { shardId: this.shard.id, guildCount }; // Utiliser `this.shard.id` ici
        } else {
          return { shardId: this.shard.id, guildCount: 0 }; // Si pas prêt, renvoyer 0 guildes
        }
      }).then((results) => {
        const shardInfo = results.find((result: { shardId: number }) => result.shardId === shardId);
        if (shardInfo) {
          message.reply(`Ce serveur se trouve sur le shard ${shardInfo.shardId}, qui gère ${shardInfo.guildCount} serveur(s).`);
        } else {
          message.reply(`Impossible de récupérer les informations pour le shard ${shardId}.`);
        }
      }).catch(err => {
        message.reply("Erreur lors de la récupération des informations du shard.");
        console.error(err);
      });
    } else {
      message.reply("Impossible de déterminer le shard pour ce serveur.");
    }
  }
});

// Suivi des événements des shards pour mettre à jour les statuts
manager.on("shardCreate", (shard) => {
  console.log(`[ShardManager] Le shard ${shard.id} a été créé.`);

  // Suivi des événements pour chaque shard
  shard.on("ready", () => {
    shardStatuses[shard.id] = "Prêt";
  });

  shard.on("reconnecting", () => {
    shardStatuses[shard.id] = "Reconnexion";
  });

  shard.on("disconnect", () => {
    shardStatuses[shard.id] = "Déconnecté";
  });

  shard.on("death", () => {
    shardStatuses[shard.id] = "Mort";
  });

  shard.on("error", () => {
    shardStatuses[shard.id] = "Erreur";
  });
});

// Lancer les shards
manager
  .spawn({ delay: 5500, timeout: 30000 })
  .then(() => console.log("[ShardManager] Tous les shards ont été lancés."))
  .catch((err) => console.error("[ShardManager] Erreur lors du lancement des shards :", err));

// Connecter le client à Discord
client.login(TOKEN).catch((error) => {
  console.error("Erreur lors de la connexion à Discord:", error);
});
