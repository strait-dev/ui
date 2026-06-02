import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@strait/ui/components/empty";

export default function EmptyBorderless() {
  return (
    <div className="w-96 rounded-xl border p-4">
      <Empty border={false} className="min-h-40">
        <EmptyHeader>
          <EmptyTitle>No activity</EmptyTitle>
          <EmptyDescription>
            Activity will appear here once data is available.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
