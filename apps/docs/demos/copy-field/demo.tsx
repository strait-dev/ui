import { CopyField } from "@strait/ui/components/copy-field";

export default function CopyFieldDemo() {
  return (
    <div className="w-full max-w-md">
      <CopyField
        description="Copy this name into your deployment provider."
        label="Environment variable"
        value="NEXT_PUBLIC_API_URL"
      />
    </div>
  );
}
