import { CopyButton } from "@strait/ui/components/copy-button";

export default function CopyButtonDemo() {
  return (
    <CopyButton
      aria-label="Copy install command"
      text="npm install @strait/ui"
    />
  );
}
