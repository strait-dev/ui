import { Button } from "@strait/ui/components/button";
import { ChartEmptyState } from "@strait/ui/components/chart-empty-state";

export default function ChartEmptyStateDemo() {
  return (
    <div className="flex h-64 w-80 items-center justify-center rounded-lg border">
      <ChartEmptyState
        action={<Button size="sm">Add data source</Button>}
        message="Add a data source to start seeing charts here."
        title="Nothing to display"
      />
    </div>
  );
}
