import { CommandSnippet } from "@strait/ui/components/command-snippet";

export default function CommandSnippetVariants() {
  return (
    <div className="grid w-full max-w-2xl gap-4">
      {(["terminal", "card", "muted", "minimal"] as const).map((variant) => (
        <div className="grid gap-1.5" key={variant}>
          <p className="font-medium text-muted-foreground text-xs">{variant}</p>
          <CommandSnippet
            command="bun run verify"
            copyable={false}
            title="Verify"
            variant={variant}
          />
        </div>
      ))}
    </div>
  );
}
