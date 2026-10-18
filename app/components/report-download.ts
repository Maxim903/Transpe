import { jsPDF } from "jspdf";

export type DownloadReportData = {
  editor: string;
  isSimulation?: boolean;
  isCloudAct?: boolean;
  recipientName: string;
  recipientEmail: string;
  organization: string;
  period: string;
  requestType: string;
  country: string;
  metricLabel: string;
  total: number;
  accounts: number;
  countryCount: number;
  history: Array<{ period: string; value: number }>;
  countries: Array<{ name: string; value: number }>;
};

const colors = {
  navy: [15, 23, 42] as const,
  blue: [37, 99, 235] as const,
  cyan: [125, 211, 252] as const,
  ink: [15, 23, 42] as const,
  muted: [100, 116, 139] as const,
  line: [226, 232, 240] as const,
  canvas: [248, 250, 252] as const,
  paleBlue: [239, 246, 255] as const,
  white: [255, 255, 255] as const,
};

const numberFormat = new Intl.NumberFormat("fr-FR");
const compactFormat = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function cleanText(value: string): string {
  return value
    .replace(/[·•]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"');
}

function fittedText(pdf: jsPDF, value: string, maxWidth: number): string {
  const text = cleanText(value);
  if (pdf.getTextWidth(text) <= maxWidth) return text;

  let shortened = text;
  while (shortened.length > 1 && pdf.getTextWidth(`${shortened}...`) > maxWidth) {
    shortened = shortened.slice(0, -1);
  }
  return `${shortened.trimEnd()}...`;
}

function drawBrandMark(pdf: jsPDF, x: number, y: number, size: number): void {
  pdf.setFillColor(...colors.blue);
  pdf.roundedRect(x, y, size, size, 3, 3, "F");

  const baseline = y + size * 0.78;
  const barWidth = size * 0.1;
  const gap = size * 0.11;
  const start = x + size * 0.19;
  const heights = [0.22, 0.39, 0.58, 0.43];
  heights.forEach((height, index) => {
    pdf.setFillColor(...colors.white);
    pdf.roundedRect(
      start + index * (barWidth + gap),
      baseline - size * height,
      barWidth,
      size * height,
      0.5,
      0.5,
      "F",
    );
  });

  pdf.setDrawColor(...colors.cyan);
  pdf.setLineWidth(0.7);
  const points = [
    [x + size * 0.18, y + size * 0.48],
    [x + size * 0.38, y + size * 0.34],
    [x + size * 0.58, y + size * 0.4],
    [x + size * 0.81, y + size * 0.2],
  ];
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (previous && current) {
      pdf.line(previous[0] ?? 0, previous[1] ?? 0, current[0] ?? 0, current[1] ?? 0);
    }
  }
}

function drawHeader(
  pdf: jsPDF,
  pageWidth: number,
  title: string,
  subtitle: string,
  compact = false,
): void {
  const headerHeight = compact ? 52 : 66;
  pdf.setFillColor(...colors.navy);
  pdf.rect(0, 0, pageWidth, headerHeight, "F");

  pdf.setDrawColor(96, 165, 250);
  pdf.setLineWidth(0.25);
  pdf.circle(pageWidth - 7, 8, 25, "S");
  pdf.circle(pageWidth - 7, 8, 32, "S");

  const markSize = compact ? 15 : 19;
  drawBrandMark(pdf, 16, 11, markSize);
  const wordX = 16 + markSize + 7;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(compact ? 15 : 17);
  pdf.setTextColor(...colors.white);
  pdf.text("Transpa", wordX, compact ? 21 : 23);
  const wordWidth = pdf.getTextWidth("Transpa");
  pdf.setTextColor(...colors.cyan);
  pdf.text("Tech", wordX + wordWidth, compact ? 21 : 23);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(203, 213, 225);
  pdf.text("EXPLORER LES DONNEES DE TRANSPARENCE", wordX, compact ? 28 : 31);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(...colors.cyan);
  pdf.text("RAPPORT DE TRANSPARENCE", 16, compact ? 39 : 44);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(compact ? 16 : 21);
  pdf.setTextColor(...colors.white);
  pdf.text(fittedText(pdf, title, pageWidth - 32), 16, compact ? 47 : 58);

  if (!compact) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(203, 213, 225);
    pdf.text(
      fittedText(pdf, subtitle, pageWidth - 36),
      pageWidth - 16,
      58,
      { align: "right" },
    );
  }
}

function drawFooter(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  pageNumber: number,
  pageCount: number,
  isSimulation: boolean,
  isCloudAct: boolean,
): void {
  const left = 16;
  const right = pageWidth - 16;
  pdf.setDrawColor(...colors.line);
  pdf.setLineWidth(0.25);
  pdf.line(left, pageHeight - 14, right, pageHeight - 14);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...colors.muted);
  pdf.text(
    isCloudAct
      ? "CLOUD Act - simulation: donnees fictives, non issues de rapports reels"
      : isSimulation
        ? "SIMULATION: donnees fictives, non issues de rapports reels"
        : "Source: rapports de transparence Microsoft LERR",
    left,
    pageHeight - 8,
  );
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...colors.blue);
  pdf.text("TRANSPATECH", pageWidth / 2, pageHeight - 8, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...colors.muted);
  pdf.text(`${pageNumber} / ${pageCount}`, right, pageHeight - 8, { align: "right" });
}

function drawPanel(
  pdf: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: readonly [number, number, number] = colors.white,
): void {
  pdf.setDrawColor(...colors.line);
  pdf.setFillColor(...fill);
  pdf.roundedRect(x, y, width, height, 2.5, 2.5, "FD");
}

function drawSectionLabel(pdf: jsPDF, label: string, x: number, y: number): void {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(...colors.muted);
  pdf.text(cleanText(label.toLocaleUpperCase("fr")), x, y);
}

function drawMetricCard(
  pdf: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  value: number,
  highlight = false,
): void {
  drawPanel(pdf, x, y, width, 34, highlight ? colors.paleBlue : colors.white);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(6.5);
  pdf.setTextColor(...colors.muted);
  pdf.text(fittedText(pdf, label, width - 8), x + 4, y + 9);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(numberFormat.format(value).length > 10 ? 14 : 18);
  if (highlight) {
    pdf.setTextColor(...colors.blue);
  } else {
    pdf.setTextColor(...colors.ink);
  }
  pdf.text(numberFormat.format(value), x + 4, y + 25);
}

function drawTrendChart(
  pdf: jsPDF,
  data: DownloadReportData,
  pageWidth: number,
  pageHeight: number,
): void {
  const x = 16;
  const y = 199;
  const width = pageWidth - 32;
  const height = pageHeight - y - 20;
  drawPanel(pdf, x, y, width, height);

  drawSectionLabel(pdf, "Evolution dans le temps", x + 7, y + 10);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...colors.muted);
  pdf.text(cleanText(`${data.metricLabel} par periode`), x + 7, y + 16);

  const plotLeft = x + 24;
  const plotRight = x + width - 8;
  const plotTop = y + 24;
  const plotBottom = y + height - 13;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const maximum = Math.max(1, ...data.history.map((item) => item.value));

  pdf.setLineWidth(0.2);
  for (let gridIndex = 0; gridIndex <= 3; gridIndex += 1) {
    const ratio = gridIndex / 3;
    const gridY = plotBottom - plotHeight * ratio;
    pdf.setDrawColor(...colors.line);
    pdf.line(plotLeft, gridY, plotRight, gridY);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(...colors.muted);
    pdf.text(compactFormat.format(maximum * ratio), plotLeft - 2, gridY + 1, {
      align: "right",
    });
  }

  if (data.history.length > 0) {
    const points = data.history.map((item, index) => ({
      x:
        data.history.length === 1
          ? plotLeft + plotWidth / 2
          : plotLeft + (plotWidth * index) / (data.history.length - 1),
      y: plotBottom - (Math.max(0, item.value) / maximum) * plotHeight,
    }));

    pdf.setDrawColor(...colors.blue);
    pdf.setLineWidth(0.8);
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      if (previous && current) pdf.line(previous.x, previous.y, current.x, current.y);
    }
    points.forEach((point) => {
      pdf.setFillColor(...colors.white);
      pdf.setDrawColor(...colors.blue);
      pdf.setLineWidth(0.6);
      pdf.circle(point.x, point.y, 1.1, "FD");
    });

    const labelIndexes = [...new Set([0, Math.floor((data.history.length - 1) / 2), data.history.length - 1])];
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(...colors.muted);
    labelIndexes.forEach((index) => {
      const item = data.history[index];
      const point = points[index];
      if (item && point) {
        pdf.text(cleanText(item.period), point.x, plotBottom + 7, { align: "center" });
      }
    });
  }
}

function drawCountryChart(pdf: jsPDF, data: DownloadReportData, pageWidth: number): void {
  const x = 16;
  const y = 68;
  const width = pageWidth - 32;
  const height = 198;
  drawPanel(pdf, x, y, width, height);
  drawSectionLabel(pdf, "Top des pays", x + 8, y + 12);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...colors.muted);
  pdf.text(cleanText(`Indicateur: ${data.metricLabel} - Periode: ${data.period}`), x + 8, y + 19);

  const rows = data.countries.slice(0, 8);
  const maximum = Math.max(1, ...rows.map((item) => item.value));
  const barX = x + 8;
  const barWidth = width - 16;
  const rowStart = y + 32;
  const rowGap = 20;

  rows.forEach((item, index) => {
    const rowY = rowStart + index * rowGap;
    const percentage = maximum > 0 ? item.value / maximum : 0;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.ink);
    pdf.text(`${String(index + 1).padStart(2, "0")}.`, barX, rowY);
    pdf.setFont("helvetica", "normal");
    pdf.text(fittedText(pdf, item.name, barWidth - 45), barX + 10, rowY);
    pdf.setFont("helvetica", "bold");
    pdf.text(numberFormat.format(item.value), x + width - 8, rowY, { align: "right" });

    pdf.setFillColor(...colors.canvas);
    pdf.roundedRect(barX + 10, rowY + 3, barWidth - 10, 3, 1.5, 1.5, "F");
    pdf.setFillColor(...colors.blue);
    pdf.roundedRect(
      barX + 10,
      rowY + 3,
      Math.max(1, (barWidth - 10) * percentage),
      3,
      1.5,
      1.5,
      "F",
    );
  });

  if (rows.length === 0) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.muted);
    pdf.text("Aucune donnee disponible pour cette selection.", x + 8, y + 40);
  }

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...colors.muted);
  pdf.text(
    "Barres comparees au pays avec la valeur la plus elevee dans cette selection.",
    x + 8,
    y + height - 8,
  );
}

export function downloadTransparencyReport(data: DownloadReportData): void {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageCount = data.countries.length > 0 ? 2 : 1;
  const generatedDate = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
    new Date(),
  );

  drawHeader(pdf, pageWidth, data.editor, `Periode ${data.period}`);

  drawPanel(pdf, 16, 74, pageWidth - 32, 33, colors.canvas);
  drawSectionLabel(pdf, "Rapport personnalise pour", 23, 82);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(...colors.ink);
  pdf.text(fittedText(pdf, data.recipientName, 100), 23, 90);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...colors.muted);
  pdf.text(fittedText(pdf, data.recipientEmail, 100), 23, 97);
  if (data.organization) {
    drawSectionLabel(pdf, "Organisation", 133, 82);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.ink);
    pdf.text(fittedText(pdf, data.organization, pageWidth - 156), 133, 91);
  }
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...colors.muted);
  pdf.text(`Genere le ${cleanText(generatedDate)}`, 23, 102);

  drawPanel(pdf, 16, 114, pageWidth - 32, 29);
  const filterCells = [
    { label: "EDITEUR", value: data.editor },
    { label: "PERIODE", value: data.period },
    { label: "TYPE DE DEMANDE", value: data.requestType },
    { label: "PAYS", value: data.country },
  ];
  const cellWidth = (pageWidth - 48) / filterCells.length;
  filterCells.forEach((cell, index) => {
    const cellX = 22 + index * cellWidth;
    drawSectionLabel(pdf, cell.label, cellX, 123);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.ink);
    pdf.text(fittedText(pdf, cell.value, cellWidth - 6), cellX, 133);
  });

  const cardY = 151;
  const cardGap = 5;
  const cardWidth = (pageWidth - 32 - cardGap * 2) / 3;
  drawMetricCard(pdf, 16, cardY, cardWidth, data.metricLabel, data.total, true);
  drawMetricCard(
    pdf,
    16 + cardWidth + cardGap,
    cardY,
    cardWidth,
    "Comptes specifies",
    data.accounts,
  );
  drawMetricCard(
    pdf,
    16 + (cardWidth + cardGap) * 2,
    cardY,
    cardWidth,
    "Pays couverts",
    data.countryCount,
  );

  drawTrendChart(pdf, data, pageWidth, pageHeight);
  drawFooter(
    pdf,
    pageWidth,
    pageHeight,
    1,
    pageCount,
    Boolean(data.isSimulation),
    Boolean(data.isCloudAct),
  );

  if (data.countries.length > 0) {
    pdf.addPage();
    drawHeader(pdf, pageWidth, "Repartition par pays", data.period, true);
    drawCountryChart(pdf, data, pageWidth);
    drawFooter(
      pdf,
      pageWidth,
      pageHeight,
      2,
      pageCount,
      Boolean(data.isSimulation),
      Boolean(data.isCloudAct),
    );
  }

  const filename = `rapport-${data.editor}-${data.period}`
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  pdf.save(`${filename}.pdf`);
}
