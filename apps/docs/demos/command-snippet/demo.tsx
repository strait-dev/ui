import { CommandSnippet } from "@strait/ui/components/command-snippet";

export default function CommandSnippetDemo() {
  return (
    <div className="w-full max-w-xl">
      <CommandSnippet command="bun add @strait/ui" title="Install" />
    </div>
  );
}
