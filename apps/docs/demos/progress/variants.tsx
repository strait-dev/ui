import { Progress } from "@strait/ui/components/progress";

export default function ProgressVariants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {(["default", "success", "warning", "info", "destructive"] as const).map(
        (variant) => (
          <div className="flex flex-col gap-1.5" key={variant}>
            <span className="text-muted-foreground text-xs">
              variant="{variant}"
            </span>
            <Progress
              aria-label={`${variant} progress`}
              value={60}
              variant={variant}
            />
          </div>
        )
      )}
    </div>
  );
}
