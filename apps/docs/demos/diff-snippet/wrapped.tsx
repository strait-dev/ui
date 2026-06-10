import {
  DiffSnippet,
  type DiffSnippetLine,
} from "@strait/ui/components/diff-snippet";

const lines: DiffSnippetLine[] = [
  { type: "context", content: "const config = createThemeConfig({" },
  {
    type: "add",
    content:
      "  description: 'This intentionally long line demonstrates wrapping inside constrained documentation columns and narrow side panels.',",
  },
  {
    type: "warning",
    content: "  migration: 'Check downstream imports before release',",
  },
  { type: "context", content: "});" },
];

export default function DiffSnippetWrapped() {
  return (
    <div className="w-80">
      <DiffSnippet
        filename="long-config.ts"
        language="ts"
        lines={lines}
        maxHeight={120}
        showLineNumbers
        wrap
      />
    </div>
  );
}
