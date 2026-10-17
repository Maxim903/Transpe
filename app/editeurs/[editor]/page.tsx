import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Dashboard from "../../components/dashboard";
import { editors, getEditor } from "../../lib/editors";
import { loadMicrosoftReports } from "../../lib/reports";

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
    return { title: "Éditeur introuvable — TranspaTech" };
  }

  return {
    title: `Explorateur / ${editor.name} — TranspaTech`,
    description: `Tableau de bord des demandes de transparence pour ${editor.name}.`,
  };
}

export default async function EditorDashboardPage({
  params,
}: {
  params: Promise<{ editor: string }>;
}) {
  const { editor: slug } = await params;
  const editor = getEditor(slug);

  if (!editor) {
    notFound();
  }

  const reports = editor.slug === "microsoft" ? await loadMicrosoftReports() : [];

  return <Dashboard editor={editor} reports={reports} />;
}
