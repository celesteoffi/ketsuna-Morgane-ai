import fs from 'fs';
import path from 'path';

// Fonction pour vérifier si un utilisateur est blacklisté
export function isBlacklisted(userId: string): boolean {
  const blacklist = loadBlacklist();  // Charger la blacklist à chaque vérification
  return blacklist.includes(userId);
}

// Fonction pour charger la liste noire à partir du fichier JSON
export function loadBlacklist(): string[] {
  try {
    const blacklistPath = path.resolve(__dirname, "../../blacklist.json");
    const data = fs.readFileSync(blacklistPath, "utf8");
    const json = JSON.parse(data);
    return json.blacklist || [];
  } catch (err) {
    console.error("Erreur de chargement de la blacklist : ", err);
    return [];
  }
}

// Fonction pour sauvegarder la liste noire dans le fichier JSON
export function saveBlacklist(blacklist: string[]): void {
  const blacklistPath = path.resolve(__dirname, "../../blacklist.json");
  const jsonData = JSON.stringify({ blacklist }, null, 2);
  fs.writeFileSync(blacklistPath, jsonData, "utf8");
}
