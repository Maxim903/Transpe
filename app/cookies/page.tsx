import type { Metadata } from "next";
import { LegalPage } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Cookies et traceurs — TranspaTech",
  description: "Informations sur les cookies et traceurs utilisés par TranspaTech.",
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookies et traceurs">
      <section>
        <h2>Traceurs utilisés par TranspaTech</h2>
        <p>
          Le code de TranspaTech n’intègre actuellement ni cookie publicitaire, ni outil
          d’analyse d’audience, ni traceur de réseaux sociaux. Le site n’utilise donc pas de
          bannière de consentement pour ces finalités.
        </p>
        <p>
          Le fonctionnement technique du site et de son hébergement peut nécessiter des
          mécanismes strictement techniques gérés par la plateforme. Leur présence et leur
          durée peuvent dépendre de la configuration et évoluer avec le service ; consultez
          également la{" "}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">
            notice de confidentialité de Vercel
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Évolution de cette page</h2>
        <p>
          Si des outils d’audience, de publicité ou d’autres traceurs sont ajoutés, cette
          information devra être mise à jour et les mesures d’information ou de consentement
          applicables seront mises en place avant leur activation.
        </p>
      </section>

      <section>
        <h2>En savoir plus</h2>
        <p>
          Consultez les recommandations de la{" "}
          <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noreferrer">
            CNIL sur les cookies et autres traceurs
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
