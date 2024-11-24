"use client";
import ResponsiveAppBar from "../components/Appbar";
import { Link } from "@mui/material";

export default function Page() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <ResponsiveAppBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxHeight: "100vh",
          minHeight: "90vh",
        }}
      >
        <Link
          href="https://discord.com/oauth2/authorize?client_id=1190014646351036577&permissions=551903627328&scope=bot"
          style={{ color: "white", textDecoration: "none" }}
        >
          <h2
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
            }}
          >
            Invite the bot to your server
          </h2>
        </Link>
      </div>
    </div>
  );
}
