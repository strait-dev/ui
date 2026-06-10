import { DiffSnippet } from "@strait/ui/components/diff-snippet";

export default function DiffSnippetStateMatrix() {
  return (
    <div className="w-full max-w-xl">
      <DiffSnippet
        copyable={false}
        filename="states.diff"
        language="diff"
        lines={[
          { type: "context", content: "unchanged context line" },
          { type: "add", content: "added line using success tokens" },
          { type: "remove", content: "removed line using destructive tokens" },
          { type: "info", content: "informational annotation" },
          { type: "warning", content: "migration warning annotation" },
          { type: "error", content: "blocking error annotation" },
        ]}
        showLineNumbers
      />
    </div>
  );
}
