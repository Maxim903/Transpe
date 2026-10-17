import type { Metadata } from "next";
import { LegalContactNotice, LegalPage } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Confidentialité — TranspaTech",
  description: "Informations sur les données personnelles et la confidentialité sur TranspaTech.",
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Confidentialité">
      <section>
        <h2>Fonctionnement du site</h2>
        <p>
          TranspaTech ne propose pas de compte utilisateur, de formulaire de contact ni de
          publicité ciblée. Le site n’intègre pas volontairement d’outil d’analyse d’audience
          ou de suivi publicitaire.
        </p>
      </section>

      <section>
        <h2>Formulaire de téléchargement PDF</h2>
        <p>
          Le nom, l’adresse e-mail et l’organisation saisis dans le formulaire de téléchargement
          servent uniquement à personnaliser le PDF généré dans le navigateur. Ces valeurs ne
          sont pas transmises à l’application et ne sont pas enregistrées par TranspaTech.
          Elles apparaissent dans le fichier téléchargé et restent sous le contrôle de la
          personne qui le télécharge.
        </p>
      </section>

      <section>
        <h2>Données techniques de connexion</h2>
        <p>
          Pour fournir, sécuriser et diagnostiquer l’hébergement, Vercel peut traiter des
          données techniques liées aux requêtes, telles que l’adresse IP, les informations du
          navigateur, l’URL demandée et l’heure de connexion. Ces traitements relèvent aussi
          des services et paramètres de l’hébergeur. Consultez la{" "}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">
            notice de confidentialité de Vercel
          </a>{" "}
          pour ses pratiques, durées et modalités.
        </p>
      </section>

      <section>
        <h2>Destinataires et conservation</h2>
        <p>
          TranspaTech ne collecte pas de coordonnées par son formulaire PDF et ne dispose pas
          d’une base de données de comptes visiteurs. Les informations techniques nécessaires
          au fonctionnement du service peuvent être traitées par l’hébergeur selon ses propres
          conditions et réglages. TranspaTech ne peut pas annoncer de durée de conservation
          indépendante pour ces journaux.
        </p>
      </section>

      <section>
        <h2>Vos demandes</h2>
        <p>
          Lorsqu’un traitement relevant du RGPD s’applique, les demandes concernant les données
          personnelles peuvent être adressées au responsable concerné, selon la nature du
          traitement. Pour les traitements propres à l’hébergement, Vercel fournit ses{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            informations de contact et de confidentialité
          </a>
          .
        </p>
        <LegalContactNotice />
        <p>
          Pour en savoir plus sur les droits prévus par le RGPD, consultez la{" "}
          <a
            href="https://www.cnil.fr/fr/les-droits-pour-maitriser-vos-donnees-personnelles"
            target="_blank"
            rel="noreferrer"
          >
            CNIL
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
