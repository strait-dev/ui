import { CopyField } from "@strait/ui/components/copy-field";

export default function CopyFieldVariants() {
  return (
    <div className="grid w-full max-w-md gap-4">
      {(["default", "muted", "ghost", "terminal"] as const).map((variant) => (
        <CopyField
          description={undefined}
          key={variant}
          label={variant}
          value="NEXT_PUBLIC_API_URL"
          variant={variant}
        />
      ))}
    </div>
  );
}
