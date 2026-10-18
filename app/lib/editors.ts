export const editors = [
  { slug: "amazon", name: "Amazon", hasData: true, dataStatus: "simulation", cloudActStatus: "simulation" },
  { slug: "apple", name: "Apple", hasData: true, dataStatus: "simulation", cloudActStatus: "simulation" },
  { slug: "google", name: "Google", hasData: true, dataStatus: "simulation", cloudActStatus: "simulation" },
  { slug: "meta", name: "Meta", hasData: true, dataStatus: "simulation", cloudActStatus: "simulation" },
  { slug: "microsoft", name: "Microsoft", hasData: true, dataStatus: "real", cloudActStatus: "simulation" },
] as const;

export type Editor = (typeof editors)[number];

export function getEditor(slug: string): Editor | undefined {
  return editors.find((editor) => editor.slug === slug);
}
