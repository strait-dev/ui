import { Button } from "@strait/ui/components/button";
import { ChartEmptyState } from "@strait/ui/components/chart-empty-state";

export default function ChartEmptyStateWithAction() {
  return (
    <ChartEmptyState
      action={<Button size="sm">Add data source</Button>}
      message="Connect a data source to populate this chart."
      title="No chart data"
    />
  );
}
