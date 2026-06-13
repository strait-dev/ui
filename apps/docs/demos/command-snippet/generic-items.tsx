import { CommandSnippet } from "@strait/ui/components/command-snippet";

const items = [
  { label: "curl", command: "curl https://api.strait.dev/health" },
  { label: "docker", command: "docker run --rm strait/ui:latest" },
  { label: "brew", command: "brew install strait-dev/tap/strait" },
];

export default function CommandSnippetGenericItems() {
  return (
    <div className="w-full max-w-xl">
      <CommandSnippet defaultValue="docker" items={items} title="Run with" />
    </div>
  );
}
