"use client";

import { useRouter } from "next/navigation";
import { editors } from "../lib/editors";

export default function EditorSelect({ value }: { value: string }) {
  const router = useRouter();

  return (
    <label className="editor-select">
      <span className="sr-only">Choisir un éditeur</span>
      <select
        aria-label="Choisir un éditeur"
        value={value}
        onChange={(event) => router.push(`/editeurs/${event.target.value}`)}
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
