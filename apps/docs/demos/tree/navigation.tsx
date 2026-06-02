import { File01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Tree, TreeItem } from "@strait/ui/components/tree";

export default function TreeNavigationDemo() {
  return (
    <div className="max-w-sm">
      <Tree aria-label="Settings navigation" selectionMode="single">
        <TreeItem icon={Folder01Icon} id="account" title="Account">
          <TreeItem icon={File01Icon} id="profile" title="Profile" />
          <TreeItem icon={File01Icon} id="security" title="Security" />
          <TreeItem icon={File01Icon} id="billing" title="Billing" />
        </TreeItem>
        <TreeItem icon={Folder01Icon} id="workspace" title="Workspace">
          <TreeItem icon={File01Icon} id="general" title="General" />
          <TreeItem icon={File01Icon} id="members" title="Members" />
          <TreeItem icon={File01Icon} id="integrations" title="Integrations" />
        </TreeItem>
        <TreeItem icon={File01Icon} id="notifications" title="Notifications" />
      </Tree>
    </div>
  );
}
