import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Dashboard from "../components/dashboard";
import { getEditor } from "../lib/editors";
import { loadCloudActReports } from "../lib/reports";

export const metadata: Metadata = {
  title: "CLOUD Act — TranspaTech",
  description: "Explorer un tableau de démonstration des demandes associées au CLOUD Act, par éditeur.",
};

export default async function CloudActPage({
  searchParams,
}: {
  searchParams: Promise<{ editor?: string }>;
}) {
  const { editor: editorSlug = "microsoft" } = await searchParams;
  const editor = getEditor(editorSlug);

  if (!editor) {
    notFound();
  }

  const reports = await loadCloudActReports(editor.slug);

  return <Dashboard editor={editor} reports={reports} isCloudAct />;
}