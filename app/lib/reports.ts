import { readFile } from "node:fs/promises";
import path from "node:path";

export type ReportRow = {
  country: string;
  requests: number;
  accounts: number;
  service: string;
  period: string;
  sourceFile: string;
};

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let insideQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (character === '"') {
      if (insideQuotes && content[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === "," && !insideQuotes) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && content[index + 1] === "\n") {
        index += 1;
      }
      row.push(field);
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function numberFrom(value: string | undefined): number {
  const parsed = Number(value?.trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function loadMicrosoftReports(): Promise<ReportRow[]> {
  const csvPath = path.join(
    process.cwd(),
    "demande d'accord acces au données",
    "normalise",
    "Microsoft_LERR_Master_All.csv",
  );
  const csv = await readFile(csvPath, "utf8");
  const [header = [], ...records] = parseCsv(csv);
  const columns = new Map(header.map((name, index) => [name, index]));
  const get = (record: string[], column: string) =>
    record[columns.get(column) ?? -1]?.trim() ?? "";
  const uniqueReports = new Map<string, ReportRow>();

  for (const record of records) {
    const country = get(record, "Country");
    const service = get(record, "Service_Or_Type");
    const sourceFile = get(record, "Source_File");
    const sourcePeriod = sourceFile.match(/-(\d{4})-(H[12])/i);
    const year = get(record, "Year_Period").match(/\d{4}/)?.[0];
    const period = sourcePeriod
      ? `${sourcePeriod[1]}-${sourcePeriod[2].toUpperCase()}`
      : year ?? get(record, "Year_Period");

    if (!country || /^total\b/i.test(country) || !service || !period) {
      continue;
    }

    const report: ReportRow = {
      country,
      requests: numberFrom(get(record, "Total_Requests")),
      accounts: numberFrom(get(record, "Accounts_Specified")),
      service,
      period,
      sourceFile,
    };
    const key = [
      period,
      service,
      country.toLocaleLowerCase("fr"),
      report.requests,
      report.accounts,
    ].join("|");

    if (!uniqueReports.has(key)) {
      uniqueReports.set(key, report);
    }
  }

  return [...uniqueReports.values()];
}
