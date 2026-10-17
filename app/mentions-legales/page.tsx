import type { Metadata } from "next";
import { LegalContactNotice, LegalPage } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Mentions légales — TranspaTech",
  description: "Informations légales relatives au site TranspaTech.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <section>
        <h2>Édition du site</h2>
        <p>
          TranspaTech est édité par une personne physique agissant à titre non professionnel.
          Son identité n’est pas affichée publiquement sur cette page afin de préserver son
          anonymat.
        </p>
        <p>
          Si le droit français s’applique, le régime de l’article 6, III, 2 de la loi pour la
          confiance dans l’économie numérique permet, sous conditions, à une personne éditant
          à titre non professionnel de ne pas rendre publiques ses données personnelles
          d’identification. Cette faculté suppose notamment que les informations requises
          aient été communiquées à l’hébergeur. TranspaTech ne peut pas vérifier que cette
          démarche a été effectuée ni déterminer à lui seul le droit applicable.
        </p>
        <p>
          Avant publication, l’éditeur doit vérifier ses obligations dans son pays et dans les
          conditions applicables à son hébergement. Cette page ne garantit pas à elle seule la
          conformité juridique du site.
        </p>
      </section>

      <section>
        <h2>Directeur de la publication</h2>
        <p>
          L’éditeur du site, personne physique agissant à titre non professionnel. Son identité
          n’est pas publiée ici ; les obligations de communication à l’hébergeur restent celles
          prévues par la législation applicable.
        </p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Site hébergé par Vercel Inc. Les informations légales et les coordonnées de Vercel
          sont disponibles dans ses{" "}
          <a href="https://vercel.com/legal/terms" target="_blank" rel="noreferrer">
            conditions de service
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <LegalContactNotice />
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les marques, noms et logos cités appartiennent à leurs propriétaires respectifs.
          Les rapports sources restent soumis aux conditions définies par leurs éditeurs.
          Sauf mention contraire, la présentation et le code propres à TranspaTech ne peuvent
          être reproduits ou réutilisés sans autorisation.
        </p>
      </section>

      <section>
        <h2>Textes de référence</h2>
        <ul>
          <li>
            <a
              href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164/"
              target="_blank"
              rel="noreferrer"
            >
              Loi française pour la confiance dans l’économie numérique (LCEN)
            </a>
          </li>
          <li>
            <a
              href="https://entreprendre.service-public.gouv.fr/vosdroits/F37351"
              target="_blank"
              rel="noreferrer"
            >
              Service-Public.fr — obligations liées à la création d’un site internet
            </a>
          </li>
        </ul>
      </section>
    </LegalPage>
  );
}
