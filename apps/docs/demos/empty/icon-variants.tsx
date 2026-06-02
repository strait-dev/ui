import {
  Alert02Icon,
  FolderIcon,
  FolderOpenIcon,
  InboxIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@strait/ui/components/empty";

export default function EmptyIconVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      {(
        [
          { variant: "muted", label: "Muted", icon: InboxIcon },
          { variant: "info", label: "Info", icon: InformationCircleIcon },
          { variant: "success", label: "Success", icon: FolderOpenIcon },
          { variant: "warning", label: "Warning", icon: Alert02Icon },
          { variant: "destructive", label: "Destructive", icon: FolderIcon },
        ] as const
      ).map(({ variant, label, icon }) => (
        <Empty border className="min-h-40 w-36" key={variant}>
          <EmptyHeader>
            <EmptyMedia media="icon" variant={variant}>
              <HugeiconsIcon icon={icon} />
            </EmptyMedia>
            <EmptyTitle>{label}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ))}
    </div>
  );
}
