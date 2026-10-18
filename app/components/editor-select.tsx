"use client";

import { useRouter } from "next/navigation";
import { editors } from "../lib/editors";

export default function EditorSelect({
  value,
  context = "editor",
}: {
  value: string;
  context?: "editor" | "cloudAct";
}) {
  const router = useRouter();

  return (
    <label className="editor-select">
      <span className="sr-only">Choisir un éditeur</span>
      <select
        aria-label="Choisir un éditeur"
        value={value}
        onChange={(event) =>
          router.push(
            context === "cloudAct"
              ? `/cloud-act?editor=${event.target.value}`
              : `/editeurs/${event.target.value}`,
          )
        }
      >
        {editors.map((editor) => (
          <option key={editor.slug} value={editor.slug}>
            {editor.name}
          </option>
        ))}
      </select>
    </label>
  );
}
