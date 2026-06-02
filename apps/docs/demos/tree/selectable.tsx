import { File01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Tree, TreeItem } from "@strait/ui/components/tree";

export default function TreeSelectableDemo() {
  return (
    <div className="max-w-sm">
      <Tree
        aria-label="Documents — multiple selection"
        defaultSelectedKeys={["notes"]}
        selectionMode="multiple"
      >
        <TreeItem icon={Folder01Icon} id="docs" title="Documents">
          <TreeItem icon={File01Icon} id="report" title="annual-report.pdf" />
          <TreeItem icon={File01Icon} id="notes" title="meeting-notes.txt" />
          <TreeItem icon={File01Icon} id="budget" title="budget-2025.xlsx" />
        </TreeItem>
        <TreeItem icon={Folder01Icon} id="archive" title="Archive">
          <TreeItem icon={File01Icon} id="old-report" title="report-2024.pdf" />
        </TreeItem>
        <TreeItem icon={File01Icon} id="readme" title="README.md" />
      </Tree>
    </div>
  );
}
