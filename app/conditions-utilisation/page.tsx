import type { Metadata } from "next";
import { LegalPage } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Conditions d’utilisation et sources — TranspaTech",
  description: "Conditions d’utilisation, limites et sources des données de TranspaTech.",
};

export default function ConditionsUtilisationPage() {
  return (
    <LegalPage title="Conditions d’utilisation et sources">
      <section>
        <h2>Objet du site</h2>
        <p>
          TranspaTech est un outil d’exploration de rapports publics de transparence. Il
          présente des données agrégées à des fins d’information. Le site ne fournit ni conseil
          juridique ni évaluation des demandes individuelles.
        </p>
      </section>

      <section>
        <h2>Sources et méthode</h2>
        <p>
          Les données Microsoft actuellement intégrées proviennent des rapports LERR publiés
          par Microsoft et du fichier de données associé à ce projet. Les autres pages éditeurs
          restent sans indicateurs tant qu’un jeu de données vérifié n’est pas intégré.
        </p>
        <p>
          Les étapes de préparation et les liens vers les tableaux de bord sont décrits dans la{" "}
          <a href="/methodologie">page méthodologie</a>. Les résultats peuvent dépendre de la
          structure, des définitions et des mises à jour de chaque source ; les chiffres de
          différents éditeurs ne sont pas nécessairement directement comparables.
        </p>
        <p>
          <a
            href="https://www.microsoft.com/en-us/corporate-responsibility/lerr"
            target="_blank"
            rel="noreferrer"
          >
            Source Microsoft LERR
          </a>
        </p>
      </section>

      <section>
        <h2>Exactitude et disponibilité</h2>
        <p>
          Des efforts raisonnables sont faits pour préparer et présenter les données
          correctement. TranspaTech ne garantit toutefois ni l’absence d’erreurs, ni
          l’exhaustivité, ni la disponibilité continue du service. Pour une décision importante,
          consultez toujours le rapport original de l’éditeur.
        </p>
      </section>

      <section>
        <h2>Utilisation des contenus</h2>
        <p>
          Les noms et marques cités appartiennent à leurs titulaires respectifs. Les utilisateurs
          doivent respecter les droits applicables aux rapports sources et mentionner la source
          lorsqu’ils réutilisent des données. La reproduction du code ou de la présentation
          propre à TranspaTech nécessite l’autorisation de son titulaire, sauf exception légale.
        </p>
      </section>

      <section>
        <h2>Modification des conditions</h2>
        <p>
          Ces informations peuvent être modifiées si les fonctionnalités, les sources ou les
          obligations applicables évoluent. La date de mise à jour figure en haut de la page.
        </p>
      </section>
    </LegalPage>
  );
}
