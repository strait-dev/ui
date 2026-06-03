import { FolderIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@strait/ui/components/empty";

export default function EmptyWithIcon() {
  return (
    <Empty className="min-h-64 w-96">
      <EmptyHeader>
        <EmptyMedia media="icon">
          <HugeiconsIcon icon={FolderIcon} />
        </EmptyMedia>
        <EmptyTitle>No projects found</EmptyTitle>
        <EmptyDescription>
          Create your first project to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="brand-solid">
          <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
          New project
        </Button>
      </EmptyContent>
    </Empty>
  );
}
