import Dashboard from "./components/dashboard";
import { loadMicrosoftReports } from "./lib/reports";
import { getEditor } from "./lib/editors";

export default async function Home() {
  const reports = await loadMicrosoftReports();
  const editor = getEditor("microsoft");

  if (!editor) {
    throw new Error("Microsoft editor configuration is missing.");
  }

  return <Dashboard editor={editor} reports={reports} />;
}
