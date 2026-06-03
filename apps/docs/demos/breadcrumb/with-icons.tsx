import { CodeIcon, FolderIcon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@strait/ui/components/breadcrumb";

export default function BreadcrumbWithIcons() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink aria-label="Home" href="#">
            <HugeiconsIcon
              className="size-4"
              icon={Home01Icon}
              strokeWidth={2}
            />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="inline-flex items-center gap-1.5" href="#">
            <HugeiconsIcon
              className="size-4"
              icon={FolderIcon}
              strokeWidth={2}
            />
            Components
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="inline-flex items-center gap-1.5">
            <HugeiconsIcon className="size-4" icon={CodeIcon} strokeWidth={2} />
            breadcrumb.tsx
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
