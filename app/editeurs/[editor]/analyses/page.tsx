import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenText } from "lucide-react";
import Brand from "../../../components/brand";
import { editors, getEditor } from "../../../lib/editors";

type Analysis = {
  category: string;
  title: string;
  introduction: string;
  sections: { heading: string; paragraphs: string[] }[];
};

const analyses: Record<string, Analysis> = {
  microsoft: {
    category: "ANALYSE DES DONNÉES",
    title: "Demandes légales : lire les volumes sans leur faire dire trop",
    introduction:
      "Les rapports LERR de Microsoft permettent d’examiner les demandes légales selon le pays, la période et le type de demande. Ces dimensions éclairent les chiffres, mais ne racontent pas à elles seules ce qui s’est passé pour chaque demande.",
    sections: [
      {
        heading: "Une demande n’est pas un compte",
        paragraphs: [
          "Le jeu de données distingue le nombre de demandes du nombre de comptes spécifiés. Ces unités ne sont pas interchangeables : une demande peut concerner plusieurs comptes, et les deux séries doivent donc être lues séparément.",
          "Une hausse du volume indique davantage de demandes déclarées dans la période considérée. À elle seule, elle ne permet pas de conclure à une hausse équivalente du nombre de personnes concernées.",
        ],
      },
      {
        heading: "Comparer des périodes comparables",
        paragraphs: [
          "Les rapports sont découpés par périodes et types de demandes. Une comparaison utile conserve le même périmètre et la même catégorie d’une période à l’autre; sinon, une différence de classement peut ressembler à une évolution réelle.",
          "La répartition par pays apporte un autre angle, mais les volumes bruts ne tiennent pas compte de la population, de l’usage du service ni des pratiques juridiques locales.",
        ],
      },
      {
        heading: "Ce que ces chiffres ne montrent pas",
        paragraphs: [
          "Les agrégats publiés ne décrivent pas nécessairement l’issue de chaque demande, la quantité de données communiquées ou le contexte juridique complet. Il faut éviter de déduire ces éléments du seul nombre de demandes.",
          "L’explorateur présente les séries disponibles dans les rapports sources. La méthode de préparation et les limites de comparaison sont détaillées dans la page méthodologie.",
        ],
      },
    ],
  },
  amazon: {
    category: "ANALYSE MÉTHODOLOGIQUE",
    title: "Comparer les rapports d’Amazon : commencer par le périmètre",
    introduction:
      "Avant de comparer des volumes, il faut savoir quels services, quelles catégories de demandes et quelles périodes un rapport couvre. Sans ce cadre commun, deux chiffres proches peuvent décrire des réalités différentes.",
    sections: [
      {
        heading: "Définir ce qui est compté",
        paragraphs: [
          "Une analyse devra distinguer les demandes reçues, les comptes concernés et les réponses apportées lorsque ces indicateurs sont publiés. Ce sont des mesures différentes et leur disponibilité peut varier d’un rapport à l’autre.",
        ],
      },
      {
        heading: "Suivre les catégories dans le temps",
        paragraphs: [
          "Les catégories et les définitions doivent être vérifiées avant d’interpréter une hausse ou une baisse. Si le périmètre d’un indicateur change, la série peut ne plus être directement comparable.",
        ],
      },
      {
        heading: "État des données",
        paragraphs: [
          "Le tableau de bord indique si les valeurs affichées proviennent d’une source réelle ou d’un jeu de démonstration. Vérifiez ce statut et les fichiers sources avant d’interpréter les chiffres.",
        ],
      },
    ],
  },
  apple: {
    category: "ANALYSE MÉTHODOLOGIQUE",
    title: "Rapports d’Apple : la granularité détermine les questions possibles",
    introduction:
      "Un rapport de transparence est utile autant par ses détails que par ses totaux. La façon dont les demandes sont regroupées détermine les comparaisons que l’on peut raisonnablement faire.",
    sections: [
      {
        heading: "Examiner les unités et les catégories",
        paragraphs: [
          "Pour analyser les demandes, il faut repérer si les chiffres portent sur des requêtes, des comptes, des appareils ou une autre unité. Mélanger ces bases de comptage fausse les comparaisons.",
        ],
      },
      {
        heading: "Repérer les limites de publication",
        paragraphs: [
          "Les seuils, regroupements et périodes de publication influencent la précision de la lecture. Une catégorie absente ou agrégée ne signifie pas nécessairement qu’aucune demande n’a été reçue.",
        ],
      },
      {
        heading: "État des données",
        paragraphs: [
          "Le tableau de bord indique si les valeurs affichées proviennent d’une source réelle ou d’un jeu de démonstration. Vérifiez ce statut et les fichiers sources avant d’interpréter les chiffres.",
        ],
      },
    ],
  },
  google: {
    category: "ANALYSE MÉTHODOLOGIQUE",
    title: "Lire une évolution dans le temps sans confondre tendance et rupture",
    introduction:
      "Les séries temporelles rendent visibles les changements, mais une variation n’est interprétable que si les définitions et le périmètre des indicateurs restent suffisamment stables.",
    sections: [
      {
        heading: "Construire une série cohérente",
        paragraphs: [
          "Une comparaison dans le temps doit conserver les mêmes périodes et catégories. Les changements de définition, de couverture ou de fréquence de publication peuvent créer des ruptures qui ne reflètent pas nécessairement une évolution des demandes.",
        ],
      },
      {
        heading: "Mettre les variations en contexte",
        paragraphs: [
          "Un pic isolé mérite d’être confronté aux périodes voisines et aux notes méthodologiques du rapport. Les volumes seuls ne permettent pas d’identifier la cause d’une variation.",
        ],
      },
      {
        heading: "État des données",
        paragraphs: [
          "Le tableau de bord indique si les valeurs affichées proviennent d’une source réelle ou d’un jeu de démonstration. Vérifiez ce statut et les fichiers sources avant d’interpréter les chiffres.",
        ],
      },
    ],
  },
  meta: {
    category: "ANALYSE MÉTHODOLOGIQUE",
    title: "Demandes et modération : garder les périmètres distincts",
    introduction:
      "Les indicateurs de transparence peuvent couvrir des phénomènes différents. Une analyse rigoureuse sépare les demandes des autorités des autres mécanismes de modération ou de signalement lorsqu’ils apparaissent dans les rapports.",
    sections: [
      {
        heading: "Ne pas additionner des mesures différentes",
        paragraphs: [
          "Une demande légale, un signalement d’utilisateur et une action de modération ne désignent pas le même processus. Les agréger sous un seul total ferait perdre le contexte nécessaire à leur interprétation.",
        ],
      },
      {
        heading: "Lire les résultats avec prudence",
        paragraphs: [
          "Lorsqu’un rapport distingue les demandes reçues des suites qui leur sont données, ces colonnes doivent rester séparées. Le nombre de demandes ne permet pas, à lui seul, de déduire le nombre de contenus ou de comptes affectés.",
        ],
      },
      {
        heading: "État des données",
        paragraphs: [
          "Le tableau de bord indique si les valeurs affichées proviennent d’une source réelle ou d’un jeu de démonstration. Vérifiez ce statut et les fichiers sources avant d’interpréter les chiffres.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return editors.map(({ slug }) => ({ editor: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ editor: string }>;
}): Promise<Metadata> {
  const { editor: slug } = await params;
  const editor = getEditor(slug);

  if (!editor) {
    return { title: "Analyse introuvable — TranspaTech" };
  }

  return {
    title: `Analyses / ${editor.name} — TranspaTech`,
    description: `Analyse éditoriale des rapports de transparence de ${editor.name}.`,
  };
}

export default async function EditorAnalysisPage({
  params,
}: {
  params: Promise<{ editor: string }>;
}) {
  const { editor: slug } = await params;
  const editor = getEditor(slug);
  const analysis = analyses[slug];

  if (!editor || !analysis) {
    notFound();
  }

  return (
    <main className="analysis-page">
      <header className="methodology-header">
        <Brand className="methodology-brand" href="/" />
        <Link className="methodology-back" href={`/editeurs/${editor.slug}`}>
          <ArrowLeft size={15} />
          <span>Retour au tableau de bord</span>
        </Link>
      </header>

      <article className="analysis-article">
        <div className="analysis-breadcrumb">
          <Link href={`/editeurs/${editor.slug}`}>{editor.name}</Link>
          <span>/</span>
          <span>Analyses</span>
        </div>
        <div className="analysis-category"><BookOpenText size={15} /> {analysis.category}</div>
        <h1>{analysis.title}</h1>
        <p className="analysis-deck">{analysis.introduction}</p>
        {editor.dataStatus === "simulation" && (
          <p className="analysis-simulation-notice">
            Simulation : les valeurs du tableau de bord sont fictives et ne représentent pas
            les chiffres réels de {editor.name}.
          </p>
        )}
        <div className="analysis-byline">
          <span className="analysis-byline-mark">T</span>
          <span>La rédaction TranspaTech</span>
          <span className="analysis-byline-separator">·</span>
          <span>{editor.name}</span>
        </div>

        <div className="analysis-body">
          {analysis.sections.map(({ heading, paragraphs }, index) => (
            <section key={heading}>
              <div className="analysis-section-number">0{index + 1}</div>
              <h2>{heading}</h2>
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>

        <Link className="analysis-return" href={`/editeurs/${editor.slug}`}>
          Explorer les données de {editor.name} <ArrowRight size={16} />
        </Link>
      </article>
    </main>
  );
}