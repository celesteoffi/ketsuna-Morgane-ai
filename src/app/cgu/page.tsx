import type { Metadata } from "next";
import ButtonAppBar from "../../components/Appbar";
import { Container } from "@mui/material";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du bot Discord Morgane Ai",
};

export default function Page() {
  return (
    <div>
      <ButtonAppBar />
      <Container maxWidth="md">
        <p>
          La présente Politique de confidentialité régit la manière dont Morgane Ai
          collecte, utilise, traite et protège les informations personnelles des
          utilisateurs lorsqu'ils interagissent avec le bot Discord Morgane Ai.
        </p>
        <h2>Collecte de données</h2>
        <p>
          Morgane Ai s'engage à ne collecter aucune donnée personnelle des
          utilisateurs. Nous ne sauvegardons, n'enregistrons ni ne stockons
          aucune information personnelle identifiable. Toutes les interactions
          avec le bot sont anonymes.
        </p>
        <h2>Utilisation des données</h2>
        <p>
          Comme mentionné précédemment, Morgane Ai ne collecte aucune donnée
          personnelle des utilisateurs. Par conséquent, aucune donnée
          personnelle n'est utilisée, traitée ou partagée avec des tiers.
        </p>
        <h2>Cookies</h2>
        <p>
          Morgane Ai n'utilise pas de cookies pour collecter des informations
          personnelles.
        </p>
        <h2>Sécurité</h2>
        <p>
          La sécurité des informations des utilisateurs est importante pour
          nous. Cependant, comme nous ne collectons pas de données personnelles,
          il n'y a pas d'informations sensibles à protéger.
        </p>
        <h2>Modifications de la politique de confidentialité</h2>
        <p>
          Les développeurs de Morgane Ai se réservent le droit de modifier la
          politique de confidentialité à tout moment. Les utilisateurs seront
          informés des changements via les canaux appropriés de Discord.
        </p>
        <h2>Contact</h2>
        <p>
          Pour toute question ou préoccupation concernant la politique de
          confidentialité de Morgane Ai, veuillez nous contacter par email à
          contact@hohotutecalme.fr ou en rejoignant{" "}
          <a href="https://discord.gg/2U6Q9aKHSE">Le serveur support</a>.
        </p>
        <p>Version actuelle de la politique de confidentialité : 28/07/2023</p>
      </Container>
    </div>
  );
}
