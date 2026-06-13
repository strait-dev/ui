import { CommandSnippet } from "@strait/ui/components/command-snippet";

const commands = {
  bun: "bun add @strait/ui",
  npm: "npm install @strait/ui",
  pnpm: "pnpm add @strait/ui",
  yarn: "yarn add @strait/ui",
};

export default function CommandSnippetPackageManagers() {
  return (
    <div className="w-full max-w-xl">
      <CommandSnippet commands={commands} title="Install @strait/ui" />
    </div>
  );
}
