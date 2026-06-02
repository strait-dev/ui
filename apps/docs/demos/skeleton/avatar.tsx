import { Skeleton } from "@strait/ui/components/skeleton";

export default function SkeletonAvatar() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading profiles"
      className="flex flex-col gap-4"
      role="status"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
