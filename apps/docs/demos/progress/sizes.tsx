import { Progress } from "@strait/ui/components/progress";

export default function ProgressSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <div className="flex flex-col gap-1.5" key={size}>
          <span className="text-muted-foreground text-xs">size="{size}"</span>
          <Progress
            aria-label={`Size ${size} progress`}
            size={size}
            value={60}
          />
        </div>
      ))}
    </div>
  );
}
