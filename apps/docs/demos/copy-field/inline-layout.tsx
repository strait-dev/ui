import { CopyField } from "@strait/ui/components/copy-field";

export default function CopyFieldInlineLayout() {
  return (
    <div className="w-full max-w-xl">
      <CopyField
        description={undefined}
        label="Project ID"
        layout="inline"
        value="proj_8f3a91c2e7"
      />
    </div>
  );
}
