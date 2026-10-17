import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, Database, Filter, Layers3 } from "lucide-react";
import Brand from "../components/brand";
import { editors } from "../lib/editors";

const steps = [
  {
    number: "01",
    icon: Database,
    title: "Sources des rapports",
    description:
      "Les indicateurs sont calculés à partir des rapports de transparence publiés par chaque éditeur. La source et la disponibilité des données sont indiquées sur chaque page éditeur.",
  },
  {
    number: "02",
    icon: Filter,
    title: "Préparation des lignes",
    description:
      "Les rapports sont structurés autour de la période, du pays, du type de demande et des indicateurs disponibles. Les lignes incomplètes ou les totaux déjà calculés sont écartés lorsqu’ils sont identifiables.",
  },
  {
    number: "03",
    icon: Layers3,
    title: "Déduplication",
    description:
      "Les doublons sont repérés à partir des champs disponibles dans chaque source. Cette étape évite de compter plusieurs fois une même donnée publiée.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Calcul et affichage",
    description:
      "Les données préparées alimentent les indicateurs, l’évolution temporelle et les répartitions géographiques. Les visualisations respectent les catégories propres à chaque éditeur.",
  },
];

export const metadata = {
  title: "Notre méthode — TranspaTech",
  description: "Comment TranspaTech prépare et présente les rapports de transparence des éditeurs.",
};

export default function MethodologiePage() {
  return (
    <main className="methodology-page">
      <header className="methodology-header">
        <Brand className="methodology-brand" href="/" />
        <Link className="methodology-back" href="/#overview">
          <ArrowLeft size={15} />
          <span>Retour à l’explorateur</span>
        </Link>
      </header>

      <div className="methodology-content">
        <section className="methodology-intro">
          <div className="eyebrow"><Database size={14} /> TRANSPARENCE DES DONNÉES</div>
          <h1>Notre méthode</h1>
          <p>
            TranspaTech rassemble les rapports de transparence des grands éditeurs et les
            transforme en indicateurs faciles à explorer. Chaque éditeur dispose de son
            propre tableau de bord, adapté aux catégories de ses rapports.
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

        <section className="methodology-editors" aria-labelledby="methodology-editors-title">
          <div className="methodology-editors-heading">
            <div>
              <div className="section-kicker">EXPLORER PAR ÉDITEUR</div>
              <h2 id="methodology-editors-title">Consulter les tableaux de bord</h2>
              <p>Choisissez un éditeur pour consulter ses rapports et les données disponibles.</p>
            </div>
          </div>
          <nav className="methodology-editor-grid" aria-label="Tableaux de bord par éditeur">
            {editors.map((editor) => (
              <Link
                className="methodology-editor-card"
                href={`/editeurs/${editor.slug}`}
                key={editor.slug}
              >
                <span className="methodology-editor-status">
                  <span className={`status-dot${editor.hasData ? "" : " pending"}`} />
                  {editor.hasData ? "Rapports intégrés" : "Données à venir"}
                </span>
                <strong>{editor.name}</strong>
                <span className="methodology-editor-link">
                  Ouvrir le tableau de bord <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}