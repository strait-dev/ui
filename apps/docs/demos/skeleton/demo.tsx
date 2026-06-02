import { Skeleton } from "@strait/ui/components/skeleton";

export default function SkeletonDemo() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading profile"
      className="flex items-center gap-3"
      role="status"
    >
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
