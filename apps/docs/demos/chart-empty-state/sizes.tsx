import { ChartEmptyState } from "@strait/ui/components/chart-empty-state";

export default function ChartEmptyStateSizes() {
  return (
    <div className="flex flex-col items-center gap-8">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div className="flex flex-col items-center gap-1" key={size}>
          <span className="text-muted-foreground text-xs">size="{size}"</span>
          <ChartEmptyState
            message="No data available for this period."
            size={size}
            title="Nothing to display"
          />
        </div>
      ))}
    </div>
  );
}
