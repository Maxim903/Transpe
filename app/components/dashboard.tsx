"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowLeftRight,
  ArrowUpRight,
  BarChart3,
  BookOpenText,
  AlertTriangle,
  ChevronDown,
  Cloud,
  Database,
  FileText,
  Globe2,
  Landmark,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import Brand from "./brand";
import EditorSelect from "./editor-select";
import ReportDownloadButton from "./report-download-button";
import type { Editor } from "../lib/editors";
import type { ReportRow } from "../lib/reports";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Metric = "requests" | "accounts";

const numberFormat = new Intl.NumberFormat("fr-FR");
const compactFormat = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatPeriod(period: string): string {
  const [year, half] = period.split("-");
  return half ? `${year} · ${half === "H1" ? "S1" : "S2"}` : year;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  optionLabels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optionLabels?: Record<string, string>;
}) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <span className="select-control">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {optionLabels?.[option] ?? option}
            </option>
          ))}
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </span>
    </label>
  );
}

export default function Dashboard({
  editor,
  reports,
  isCloudAct = false,
}: {
  editor: Editor;
  reports: ReportRow[];
  isCloudAct?: boolean;
}) {
  const services = useMemo(
    () => [...new Set(reports.map((report) => report.service))].sort((a, b) => a.localeCompare(b, "fr")),
    [reports],
  );
  const [service, setService] = useState(
    services.includes("Criminal") ? "Criminal" : services[0] ?? "",
  );
  const [metric, setMetric] = useState<Metric>("requests");
  const [country, setCountry] = useState("Tous les pays");
  const [periodChoice, setPeriodChoice] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isSimulation = isCloudAct
    ? editor.cloudActStatus === "simulation"
    : editor.dataStatus === "simulation";
  const metricLabel = metric === "requests" ? "Demandes" : "Comptes spécifiés";

  const serviceReports = useMemo(
    () => reports.filter((report) => report.service === service),
    [reports, service],
  );
  const periods = useMemo(
    () =>
      [...new Set(serviceReports.map((report) => report.period))].sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [serviceReports],
  );
  const selectedPeriod = periods.includes(periodChoice)
    ? periodChoice
    : periods[periods.length - 1] ?? "";

  const trend = useMemo(() => {
    const byPeriod = new Map<string, number>();
    for (const report of serviceReports) {
      if (country !== "Tous les pays" && report.country !== country) continue;
      byPeriod.set(
        report.period,
        (byPeriod.get(report.period) ?? 0) + report[metric],
      );
    }
    return [...byPeriod.entries()]
      .sort(([left], [right]) => left.localeCompare(right, "fr"))
      .map(([period, value]) => ({
        period: formatPeriod(period),
        value,
        fullPeriod: period,
      }));
  }, [country, metric, serviceReports]);

  const periodReports = useMemo(
    () => serviceReports.filter((report) => report.period === selectedPeriod),
    [selectedPeriod, serviceReports],
  );
  const visiblePeriodReports =
    country === "Tous les pays"
      ? periodReports
      : periodReports.filter((report) => report.country === country);
  const countryTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const report of visiblePeriodReports) {
      totals.set(report.country, (totals.get(report.country) ?? 0) + report[metric]);
    }
    return [...totals.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [metric, visiblePeriodReports]);

  const currentTotal = countryTotals.reduce((sum, entry) => sum + entry.value, 0);
  const previousPeriod = periods[periods.indexOf(selectedPeriod) - 1];
  const previousTotal = serviceReports
    .filter(
      (report) =>
        report.period === previousPeriod &&
        (country === "Tous les pays" || report.country === country),
    )
    .reduce((sum, report) => sum + report[metric], 0);
  const variation =
    previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : null;
  const countryOptions = [
    "Tous les pays",
    ...[...new Set(serviceReports.map((report) => report.country))].sort((a, b) =>
      a.localeCompare(b, "fr"),
    ),
  ];
  const activeCountryCount = countryTotals.filter((entry) => entry.value > 0).length;
  const sourceCount = new Set(visiblePeriodReports.map((report) => report.sourceFile)).size;
  const topCountries = countryTotals.slice(0, 8);
  const description =
    country === "Tous les pays"
      ? `Tous les pays · ${service}`
      : `${country} · ${service}`;

  return (
    <main className="app-shell">
      <aside
        className={`sidebar${isSidebarCollapsed ? " collapsed" : ""}`}
        id="primary-sidebar"
      >
        <div className="sidebar-top">
          <Brand className="brand" href="#overview" />
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={isSidebarCollapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
            aria-controls="primary-sidebar"
            aria-expanded={!isSidebarCollapsed}
            title={isSidebarCollapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        <div className="sidebar-section-label">ESPACE DE TRAVAIL</div>
        <nav className="side-nav" aria-label="Navigation principale">
          <a
            className={`nav-item${isCloudAct ? "" : " active"}`}
            href={isCloudAct ? `/editeurs/${editor.slug}` : "#overview"}
            aria-label="Vue d’ensemble"
            title="Vue d’ensemble"
          >
            <BarChart3 size={18} />
            <span>Vue d’ensemble</span>
          </a>
          <a
            className="nav-item"
            href={isCloudAct ? `/editeurs/${editor.slug}#countries` : "#countries"}
            aria-label="Par pays"
            title="Par pays"
          >
            <Globe2 size={18} />
            <span>Par pays</span>
          </a>
          <Link
            className={`nav-item${isCloudAct ? " active" : ""}`}
            href={`/cloud-act?editor=${editor.slug}`}
            aria-label="CLOUD Act"
            title="CLOUD Act"
          >
            <Cloud size={18} />
            <span>CLOUD Act</span>
          </Link>
          <Link className="nav-item" href="/comparatif" aria-label="Comparatif" title="Comparatif">
            <ArrowLeftRight size={18} />
            <span>Comparatif</span>
          </Link>
        </nav>

        <div className="sidebar-note">
          <div className="note-icon"><ShieldCheck size={17} /></div>
          <strong>Des données ouvertes.</strong>
          <p>Explorer les demandes des autorités, rapport après rapport.</p>
          <a href="/methodologie">Notre méthode <ArrowRight size={14} /></a>
        </div>

        <div className="sidebar-footer">
          <span className={`status-dot${isCloudAct ? (isSimulation ? " pending" : "") : editor.hasData && !isSimulation ? "" : " pending"}`} />
          {isCloudAct
            ? `${isSimulation ? "Simulation " : ""}CLOUD Act · ${editor.name}`
            : isSimulation
              ? `Simulation ${editor.name}`
              : "Données Microsoft LERR"}
        </div>
      </aside>

      <div className={`main-area${isSidebarCollapsed ? " sidebar-collapsed" : ""}`} id="overview">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Explorateur</span>
            <span>/</span>
            <EditorSelect value={editor.slug} context={isCloudAct ? "cloudAct" : "editor"} />
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                {isCloudAct ? <Cloud size={14} /> : <Landmark size={14} />}
                {isCloudAct ? "RAPPORTS DE TRANSPARENCE · CLOUD ACT" : "RAPPORTS DE TRANSPARENCE"}
              </div>
              <h1>
                {isCloudAct
                  ? "Demandes associées au CLOUD Act"
                  : reports.length > 0
                    ? "Demandes d’accès légal"
                    : `Tableau de bord — ${editor.name}`}
              </h1>
              <p className="page-intro">
                {isCloudAct
                  ? `Explorer par période, type et pays les données CLOUD Act de ${editor.name}${isSimulation ? " (simulation)" : ""}.`
                  : reports.length > 0
                    ? "Comment les autorités demandent-elles l’accès aux données des utilisateurs ?"
                    : `Suivez les rapports de transparence publiés par ${editor.name}.`}
              </p>
            </div>
            <div className="heading-actions">
              <Link className="analysis-button" href={`/editeurs/${editor.slug}/analyses`}>
                <BookOpenText size={16} />
                Lire les analyses
                <ArrowRight size={14} />
              </Link>
              {reports.length > 0 && (
                <ReportDownloadButton
                  report={{
                    editor: editor.name,
                    period: formatPeriod(selectedPeriod),
                    requestType: service,
                    country,
                    metricLabel,
                    total: currentTotal,
                    accounts: visiblePeriodReports.reduce((sum, report) => sum + report.accounts, 0),
                    countryCount: activeCountryCount,
                    history: trend.map(({ period, value }) => ({ period, value })),
                    countries: topCountries,
                    isSimulation,
                    isCloudAct,
                  }}
                />
              )}
            </div>
          </section>

          {isSimulation && (
            <div className="simulation-notice" role="note">
              <AlertTriangle size={17} aria-hidden="true" />
              <p>
                <strong>Données simulées.</strong>{" "}
                {isCloudAct
                  ? `Toutes les valeurs CLOUD Act sont fictives et ne proviennent pas des rapports réels de ${editor.name}.`
                  : `Ces valeurs fictives servent uniquement à tester l’explorateur; elles ne représentent pas les chiffres réels de ${editor.name}.`}
              </p>
            </div>
          )}

          {reports.length > 0 ? (
            <>
          <section className="filter-bar" aria-label="Filtres du tableau de bord">
            <div className="filter-heading">
              <span className="filter-icon"><Activity size={16} /></span>
              <span>Explorer</span>
            </div>
            <SelectField
              label="Type de demande"
              value={service}
              onChange={(value) => {
                setService(value);
                setPeriodChoice("");
                setCountry("Tous les pays");
              }}
              options={services}
            />
            <SelectField
              label="Indicateur"
              value={metric}
              onChange={(value) => setMetric(value as Metric)}
              options={["requests", "accounts"]}
              optionLabels={{ requests: "Demandes", accounts: "Comptes spécifiés" }}
            />
            <SelectField
              label="Pays"
              value={country}
              onChange={setCountry}
              options={countryOptions}
            />
            <div className="filter-spacer" />
            <div className="period-control">
              <span>PÉRIODE</span>
              <SelectField
                label="Période"
                value={selectedPeriod}
                onChange={setPeriodChoice}
                options={periods}
              />
            </div>
          </section>

          <section className="metrics-grid" aria-label="Chiffres clés">
            <article className="metric-card metric-primary">
              <div className="metric-top"><span>{metricLabel} dans le rapport</span><span className="metric-icon purple"><FileText size={17} /></span></div>
              <div className="metric-value">{numberFormat.format(currentTotal)}</div>
              <div className="metric-foot">
                <span className="metric-sub">{formatPeriod(selectedPeriod)} · {service}</span>
                {variation !== null && (
                  <span className={`change-pill ${variation >= 0 ? "positive" : "negative"}`}>
                    {variation >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(variation).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %
                  </span>
                )}
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>Pays couverts</span><span className="metric-icon green"><Globe2 size={17} /></span></div>
              <div className="metric-value">{numberFormat.format(activeCountryCount)}</div>
              <div className="metric-foot"><span className="metric-sub">Avec au moins une demande</span><span className="mini-label">PAYS</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>Comptes spécifiés</span><span className="metric-icon blue"><Database size={17} /></span></div>
              <div className="metric-value">{compactFormat.format(periodReports.reduce((sum, report) => sum + report.accounts, 0))}</div>
              <div className="metric-foot"><span className="metric-sub">Comptes visés dans le rapport</span><span className="mini-label">COMPTES</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>Historique disponible</span><span className="metric-icon orange"><Activity size={17} /></span></div>
              <div className="metric-value">{periods.length}<span className="value-unit"> périodes</span></div>
              <div className="metric-foot"><span className="metric-sub">Depuis {periods[0] ? formatPeriod(periods[0]) : "—"}</span><span className="mini-label">{sourceCount} SOURCES</span></div>
            </article>
          </section>

          <section className="chart-card trend-card" aria-labelledby="trend-title">
            <div className="card-heading">
              <div>
                <div className="section-kicker">ÉVOLUTION DANS LE TEMPS</div>
                <h2 id="trend-title">{metricLabel} par période</h2>
                <p>{description} <span className="heading-dot">·</span> {trend.length} périodes</p>
              </div>
              <div className="chart-legend"><span className="legend-dot" />{metricLabel}</div>
            </div>
            <div className="trend-chart">
              {trend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 12, right: 12, left: 2, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 5" />
                    <XAxis
                      dataKey="period"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickMargin={12}
                      minTickGap={20}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickFormatter={(value: number) => compactFormat.format(value)}
                      width={48}
                    />
                    <Tooltip
                      contentStyle={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        boxShadow: "0 10px 28px rgba(15, 23, 42, .12)",
                        fontSize: 12,
                      }}
                      formatter={(value) => [numberFormat.format(Number(value)), metricLabel]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.fullPeriod
                          ? formatPeriod(String(payload[0].payload.fullPeriod))
                          : ""
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fill="url(#trendFill)"
                      activeDot={{ r: 5, fill: "#2563eb", stroke: "#fff", strokeWidth: 3 }}
                      dot={{ r: 3, fill: "#fff", stroke: "#2563eb", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">Aucune donnée disponible pour cette sélection.</div>
              )}
            </div>
          </section>

          <section className="lower-grid">
            <article className="chart-card country-card" id="countries">
              <div className="card-heading country-heading">
                <div>
                  <div className="section-kicker">RÉPARTITION GÉOGRAPHIQUE</div>
                  <h2>Répartition par pays</h2>
                  <p>Top 8 des pays · {formatPeriod(selectedPeriod)}</p>
                </div>
                <span className="small-card-icon"><Globe2 size={17} /></span>
              </div>
              <div className="country-chart">
                {topCountries.length > 0 ? (
                  topCountries.map((entry, index) => {
                    const share = currentTotal > 0 ? (entry.value / currentTotal) * 100 : 0;
                    return (
                      <div className="country-row" key={entry.name}>
                        <div className="country-rank">{String(index + 1).padStart(2, "0")}</div>
                        <div className="country-details">
                          <div className="country-label"><span>{entry.name}</span><strong>{numberFormat.format(entry.value)}</strong></div>
                          <div className="country-track"><span style={{ width: `${Math.max(share, 1)}%` }} /></div>
                        </div>
                        <span className="country-share">{share.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}%</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">Aucune donnée disponible pour cette période.</div>
                )}
              </div>
              <div className="country-foot"><span>Répartition des {metricLabel.toLocaleLowerCase("fr")}</span></div>
            </article>

            <article className="insight-card" id="methodology">
              <div className="insight-orb orb-one" />
              <div className="insight-orb orb-two" />
              <div className="insight-content">
                <div className="insight-icon">{isCloudAct ? <Cloud size={18} /> : <ShieldCheck size={18} />}</div>
                <div className="section-kicker">
                  {isCloudAct
                    ? "PÉRIMÈTRE CLOUD ACT"
                    : isSimulation
                      ? "JEU DE DÉMONSTRATION"
                      : "À PROPOS DES DONNÉES"}
                </div>
                <h2>
                  {isCloudAct
                    ? isSimulation
                      ? "Un tableau de démonstration, pas un rapport officiel."
                      : "Lire les données CLOUD Act avec contexte."
                    : isSimulation
                      ? `Les valeurs de ${editor.name} sont fictives.`
                      : "Lire les chiffres avec contexte."}
                </h2>
                <p>
                  {isCloudAct
                    ? isSimulation
                      ? "Ces valeurs sont des exemples fictifs. Elles ne doivent pas être citées comme des données publiées par l’éditeur ni servir à tirer des conclusions juridiques."
                      : "Ces indicateurs sont calculés à partir du fichier CLOUD Act configuré pour cet éditeur. Consultez les sources et leur périmètre avant toute comparaison."
                    : isSimulation
                      ? "Ces données servent à tester l’explorateur. Remplace le fichier de simulation par une source vérifiée avant toute interprétation ou publication."
                      : "Les rapports LERR de Microsoft regroupent les demandes légales des autorités. Les totaux sont recalculés à partir des pays, sans additionner les lignes de synthèse."}
                </p>
                {isSimulation ? (
                  <a className="insight-link" href="/methodologie">
                    Consulter la méthode <ArrowRight size={15} />
                  </a>
                ) : (
                  <a
                    className="insight-link"
                    href={isCloudAct ? "/methodologie" : "https://www.microsoft.com/en-us/corporate-responsibility/lerr"}
                    target={isCloudAct ? undefined : "_blank"}
                    rel={isCloudAct ? undefined : "noreferrer"}
                  >
                    {isCloudAct ? "Lire la méthodologie" : "Comprendre les rapports LERR"} <ArrowRight size={15} />
                  </a>
                )}
              </div>
            </article>
          </section>
            </>
          ) : (
            <section className="data-unavailable chart-card" aria-labelledby="data-unavailable-title">
              <span className="data-unavailable-icon"><Database size={21} /></span>
              <div className="section-kicker">JEU DE DONNÉES NON DISPONIBLE</div>
              <h2 id="data-unavailable-title">Les données de {editor.name} ne sont pas encore intégrées</h2>
              <p>
                Cette page est prête à accueillir ses rapports de transparence. Les graphiques
                et indicateurs apparaîtront dès qu’un jeu de données vérifié sera ajouté.
              </p>
            </section>
          )}

          <footer className="page-footer">
            <span>TranspaTech <span className="footer-dot">·</span> Explorer les données de transparence</span>
            <span>
              {isCloudAct
                ? `${isSimulation ? "Simulation " : ""}CLOUD Act · ${editor.name}`
                : isSimulation
                  ? `Simulation ${editor.name}`
                  : "Données Microsoft LERR"}
            </span>
          </footer>
        </div>
      </div>
    </main>
  );
}
