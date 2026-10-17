export const editors = [
  { slug: "amazon", name: "Amazon", hasData: false },
  { slug: "apple", name: "Apple", hasData: false },
  { slug: "google", name: "Google", hasData: false },
  { slug: "meta", name: "Meta", hasData: false },
  { slug: "microsoft", name: "Microsoft", hasData: true },
] as const;

export type Editor = (typeof editors)[number];

export function getEditor(slug: string): Editor | undefined {
  return editors.find((editor) => editor.slug === slug);
}
