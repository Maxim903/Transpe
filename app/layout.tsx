import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transpa — Transparence des demandes",
  description:
    "Explorez les demandes d'accès aux données adressées à Microsoft par les autorités.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
