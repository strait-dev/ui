import {
  FileCodeIcon,
  FileSpreadsheetIcon,
  FileZipIcon,
  Image01Icon,
  MoreHorizontalIcon,
  Pdf01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { Separator } from "@strait/ui/components/separator";

const files: {
  id: string;
  name: string;
  size: string;
  modified: string;
  icon: IconSvgElement;
}[] = [
  {
    id: "1",
    name: "Q2 Design Report.pdf",
    size: "2.4 MB",
    modified: "Jun 1, 2026",
    icon: Pdf01Icon,
  },
  {
    id: "2",
    name: "hero-banner.png",
    size: "840 KB",
    modified: "May 30, 2026",
    icon: Image01Icon,
  },
  {
    id: "3",
    name: "component-tokens.csv",
    size: "12 KB",
    modified: "May 28, 2026",
    icon: FileSpreadsheetIcon,
  },
  {
    id: "4",
    name: "theme.config.ts",
    size: "4.1 KB",
    modified: "May 26, 2026",
    icon: FileCodeIcon,
  },
  {
    id: "5",
    name: "assets-v2.zip",
    size: "18.7 MB",
    modified: "May 20, 2026",
    icon: FileZipIcon,
  },
];

export default function FileListBlock() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Files</CardTitle>
        <span className="text-muted-foreground text-sm">
          {files.length} items
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {files.map((file, index) => (
          <div key={file.id}>
            {index > 0 ? <Separator /> : null}
            <div className="flex items-center gap-3 px-6 py-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <HugeiconsIcon className="size-4" icon={file.icon} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-medium text-sm">
                  {file.name}
                </span>
                <span className="text-muted-foreground text-xs">
                  {file.size} · {file.modified}
                </span>
              </div>
              <Button aria-label="More options" size="icon" variant="ghost">
                <HugeiconsIcon icon={MoreHorizontalIcon} />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
