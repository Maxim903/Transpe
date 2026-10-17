import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, Database, Filter, Layers3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Database,
    title: "Source des rapports",
    description:
      "Les chiffres proviennent des rapports de demandes légales (LERR) publiés par Microsoft. Ils sont chargés depuis le jeu de données CSV du projet.",
  },
  {
    number: "02",
    icon: Filter,
    title: "Préparation des lignes",
    description:
      "Les lignes sans pays, type de demande ou période sont ignorées, tout comme les lignes de total déjà calculées. La période est extraite du nom du rapport lorsqu’elle est disponible, puis complétée à partir de l’année déclarée.",
  },
  {
    number: "03",
    icon: Layers3,
    title: "Déduplication",
    description:
      "Une ligne est considérée comme un doublon si elle partage la même période, le même type de demande, le même pays, le même nombre de demandes et le même nombre de comptes spécifiés. Une seule occurrence est conservée.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Calcul et affichage",
    description:
      "Après déduplication, les valeurs sont additionnées par période, type de demande et pays. Le tableau de bord utilise ces totaux pour les indicateurs, l’évolution temporelle et le classement des pays.",
  },
];

export const metadata = {
  title: "Notre méthode — Transpa",
  description: "Comment Transpa prépare et agrège les rapports de transparence Microsoft LERR.",
};

export default function MethodologiePage() {
  return (
    <main className="methodology-page">
      <header className="methodology-header">
        <Link className="methodology-brand" href="/" aria-label="Transpa, accueil">
          <span className="brand-mark"><BarChart3 size={18} /></span>
          <span>transpa<span className="brand-dot">.</span></span>
        </Link>
        <Link className="methodology-back" href="/#overview">
          <ArrowLeft size={15} /> Retour au tableau de bord
        </Link>
      </header>

      <div className="methodology-content">
        <section className="methodology-intro">
          <div className="eyebrow"><Database size={14} /> TRANSPARENCE DES DONNÉES</div>
          <h1>Notre méthode</h1>
          <p>
            Voici comment les rapports Microsoft LERR sont préparés et transformés en
            indicateurs consultables dans Transpa.
          </p>
        </section>

        <section className="methodology-steps" aria-label="Étapes de traitement des données">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <article className="methodology-step" key={number}>
              <div className="methodology-step-top">
                <span className="methodology-number">{number}</span>
                <span className="methodology-icon"><Icon size={17} /></span>
              </div>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="methodology-source">
          <div>
            <div className="section-kicker">SOURCE DE RÉFÉRENCE</div>
            <h2>Rapports de transparence Microsoft</h2>
            <p>Consultez la documentation et les rapports publiés par Microsoft.</p>
          </div>
          <a
            href="https://www.microsoft.com/en-us/corporate-responsibility/lerr"
            target="_blank"
            rel="noreferrer"
          >
            Voir les rapports <ArrowRight size={15} />
          </a>
        </section>
      </div>
    </main>
  );
}