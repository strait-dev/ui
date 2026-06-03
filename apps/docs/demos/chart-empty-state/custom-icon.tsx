import { BarChartIcon } from "@hugeicons/core-free-icons";
import { Button } from "@strait/ui/components/button";
import { ChartEmptyState } from "@strait/ui/components/chart-empty-state";

export default function ChartEmptyStateCustomIcon() {
  return (
    <ChartEmptyState
      action={
        <Button size="sm" variant="outline">
          Run query
        </Button>
      }
      icon={BarChartIcon}
      message="Run a query to populate this chart."
      title="Empty bar chart"
    />
  );
}
