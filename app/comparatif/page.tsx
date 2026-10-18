import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight, ArrowRight, CalendarDays, Database, Globe2 } from "lucide-react";
import Brand from "../components/brand";
import { editors } from "../lib/editors";
import { loadEditorReports } from "../lib/reports";

export const metadata: Metadata = {
  title: "Comparatif des éditeurs — TranspaTech",
  description: "Comparer la disponibilité et la couverture des rapports de transparence des éditeurs.",
};

export default async function ComparativePage() {
  const reportsByEditor = await Promise.all(
    editors.map(async (editor) => ({
      editor,
      reports: await loadEditorReports(editor.slug),
    })),
  );
  const loadedEditorCount = reportsByEditor.filter(({ reports }) => reports.length > 0).length;
  const simulationCount = reportsByEditor.filter(
    ({ editor, reports }) => editor.dataStatus === "simulation" && reports.length > 0,
  ).length;

  return (
    <main className="comparison-page">
      <header className="methodology-header">
        <Brand className="methodology-brand" href="/" />
        <Link className="methodology-back" href="/">
          <ArrowLeft size={15} />
          <span>Retour à l’explorateur</span>
        </Link>
      </header>

      <div className="comparison-content">
        <section className="comparison-intro">
          <div className="eyebrow"><ArrowLeftRight size={15} /> COMPARER LES ÉDITEURS</div>
          <h1>Des rapports, des périmètres différents.</h1>
          <p>
            Avant de comparer les volumes, regardons quelles données sont disponibles et ce
            qu’elles permettent de comparer. Quatre jeux ci-dessous sont des simulations :
            leurs valeurs sont fictives et ne décrivent pas le comportement réel des éditeurs.
          </p>
        </section>

        <section className="comparison-summary" aria-label="Synthèse des données intégrées">
          <div className="comparison-summary-item">
            <span className="comparison-summary-icon"><Database size={17} /></span>
            <strong>{editors.length}</strong>
            <span>éditeurs suivis</span>
          </div>
          <div className="comparison-summary-item">
            <span className="comparison-summary-icon available"><Globe2 size={17} /></span>
            <strong>{loadedEditorCount}</strong>
            <span>jeux de données chargés</span>
          </div>
          <div className="comparison-summary-item">
            <span className="comparison-summary-icon pending"><CalendarDays size={17} /></span>
            <strong>{simulationCount}</strong>
            <span>jeux simulés à remplacer</span>
          </div>
        </section>

        <section className="comparison-section" aria-labelledby="comparison-table-title">
          <div className="comparison-section-heading">
            <div>
              <div className="section-kicker">COUVERTURE DES SOURCES</div>
              <h2 id="comparison-table-title">Éditeurs suivis</h2>
            </div>
            <span className="comparison-update">Mise à jour selon les sources intégrées</span>
          </div>

          <div className="comparison-table-scroll" role="region" aria-label="Comparatif des éditeurs" tabIndex={0}>
            <table className="comparison-table">
              <caption className="sr-only">Disponibilité et couverture des rapports de transparence</caption>
              <thead>
                <tr>
                  <th scope="col">Éditeur</th>
                  <th scope="col">Données</th>
                  <th scope="col">Pays</th>
                  <th scope="col">Périodes</th>
                  <th scope="col">Catégories</th>
                  <th scope="col"><span className="sr-only">Accès</span></th>
                </tr>
              </thead>
              <tbody>
                {reportsByEditor.map(({ editor, reports }) => {
                  const isLoaded = reports.length > 0;
                  const countries = new Set(reports.map((report) => report.country));
                  const periods = new Set(reports.map((report) => report.period));
                  const categories = new Set(reports.map((report) => report.service));

                  return (
                    <tr key={editor.slug}>
                      <th scope="row">
                        <span className="comparison-editor-name">{editor.name}</span>
                      </th>
                      <td>
                        <span className={`comparison-status${isLoaded && editor.dataStatus !== "simulation" ? " is-available" : " is-pending"}`}>
                          <span className="status-dot" />
                          {!isLoaded ? "Indisponibles" : editor.dataStatus === "simulation" ? "Simulation" : "Source réelle"}
                        </span>
                      </td>
                      <td>{isLoaded ? countries.size : "—"}</td>
                      <td>{isLoaded ? periods.size : "—"}</td>
                      <td>{isLoaded ? categories.size : "—"}</td>
                      <td>
                        <Link className="comparison-open" href={`/editeurs/${editor.slug}`} aria-label={`Voir les données ${editor.name}`} title={`Voir les données ${editor.name}`}>
                          <ArrowRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="comparison-note">
            Les quatre CSV de simulation contiennent des chiffres fictifs destinés à tester
            l’explorateur. Remplace leurs lignes par des données vérifiées avant toute analyse
            ou publication; les tirets indiquent une source non disponible.
          </p>
        </section>

        <Link className="comparison-method-link" href="/methodologie">
          Lire la méthodologie <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}