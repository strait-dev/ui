import {
  File01Icon,
  Folder01Icon,
  FolderOpenIcon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import { Tree, TreeItem } from "@strait/ui/components/tree";

export default function TreeDemo() {
  return (
    <div className="max-w-sm">
      <Tree aria-label="Project files" defaultExpandedKeys={["src", "assets"]}>
        <TreeItem icon={FolderOpenIcon} id="src" title="src">
          <TreeItem icon={Folder01Icon} id="components" title="components">
            <TreeItem icon={File01Icon} id="button" title="button.tsx" />
            <TreeItem icon={File01Icon} id="input" title="input.tsx" />
          </TreeItem>
          <TreeItem icon={File01Icon} id="app" title="app.tsx" />
          <TreeItem icon={File01Icon} id="main" title="main.tsx" />
        </TreeItem>
        <TreeItem icon={FolderOpenIcon} id="assets" title="assets">
          <TreeItem icon={Image01Icon} id="logo" title="logo.svg" />
          <TreeItem icon={Image01Icon} id="bg" title="background.png" />
        </TreeItem>
        <TreeItem icon={File01Icon} id="readme" title="README.md" />
      </Tree>
    </div>
  );
}
