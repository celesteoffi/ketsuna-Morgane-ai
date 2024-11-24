import React from "react";
import Theme from "../components/theme";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

export const metadata: Metadata = {
  title: {
    default: "Morgane Ai - The AI Discord Bot",
    template: "%s | Morgane Ai",
  },
  description:
    "Morgane Ai is a Discord bot that uses AI to generates Images, Texts, and more!",
  metadataBase: new URL("http://2.7.25.92:3000/"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://Morgane Ai.com",
    siteName: "Morgane Ai",
    title: "Morgane Ai - The AI Discord Bot",
    description:
      "Morgane Ai is a Discord bot that uses AI to generates Images, Texts, and more!",
    emails: ["contact@hohotutecalme.fr"],
    countryName: "France",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Theme>{children}</Theme>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
