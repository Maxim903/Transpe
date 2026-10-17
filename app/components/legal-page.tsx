import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Brand from "./brand";

export function LegalPage({
  title,
  updatedAt = "17 octobre 2026",
  children,
}: {
  title: string;
  updatedAt?: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page">
      <header className="methodology-header">
        <Brand className="methodology-brand" href="/" />
        <Link className="methodology-back" href="/">
          <ArrowLeft size={15} />
          <span>Retour à l’explorateur</span>
        </Link>
      </header>
      <article className="legal-content">
        <div className="eyebrow">INFORMATIONS DU SITE</div>
        <h1>{title}</h1>
        <p className="legal-updated">Dernière mise à jour : {updatedAt}</p>
        <div className="legal-body">{children}</div>
      </article>
    </main>
  );
}

export function LegalContactNotice() {
  const contactEmail = process.env.LEGAL_CONTACT_EMAIL?.trim();

  return contactEmail ? (
    <p>
      Contact : <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
    </p>
  ) : (
    <p className="legal-action-notice">
      Aucune adresse de contact publique n’a été communiquée. Pour recevoir des demandes
      relatives au site ou aux données personnelles, configure une adresse e-mail dédiée
      avec la variable d’environnement <code>LEGAL_CONTACT_EMAIL</code> dans Vercel avant
      la mise en ligne.
    </p>
  );
}
