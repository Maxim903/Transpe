import type { Metadata } from "next";
import SiteFooter from "./components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "TranspaTech — Transparence des demandes",
  description:
    "Explorez les rapports de transparence des grands éditeurs et les demandes des autorités.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
