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

export default function EmptyStateBlock() {
  return (
    <Empty className="min-h-64 w-full max-w-md">
      <EmptyHeader>
        <EmptyMedia media="icon" size="lg" variant="muted">
          <HugeiconsIcon icon={FolderIcon} />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          Create your first project to start collaborating with your team.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="brand-solid">
          <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
          Create project
        </Button>
      </EmptyContent>
    </Empty>
  );
}
