import {
  DiffSnippet,
  type DiffSnippetLine,
} from "@strait/ui/components/diff-snippet";

const lines: DiffSnippetLine[] = [
  { type: "context", content: "export const radius =" },
  { type: "remove", content: "  'md';" },
  { type: "add", content: "  'lg';" },
];

export default function DiffSnippetVariants() {
  return (
    <div className="grid w-full max-w-2xl gap-4">
      {(["default", "muted", "terminal", "minimal"] as const).map((variant) => (
        <div className="grid gap-1.5" key={variant}>
          <p className="font-medium text-muted-foreground text-xs">{variant}</p>
          <DiffSnippet copyable={false} lines={lines} variant={variant} />
        </div>
      ))}
    </div>
  );
}
