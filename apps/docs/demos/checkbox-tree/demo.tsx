"use client";

import { Checkbox } from "@strait/ui/components/checkbox";
import { CheckboxTree } from "@strait/ui/components/checkbox-tree";

const PERMISSIONS_TREE = {
  id: "root",
  label: "All permissions",
  children: [
    {
      id: "users",
      label: "Users",
      defaultChecked: true,
      children: [
        { id: "users.read", label: "Read", defaultChecked: true },
        { id: "users.write", label: "Write", defaultChecked: true },
        { id: "users.delete", label: "Delete" },
      ],
    },
    {
      id: "billing",
      label: "Billing",
      children: [
        { id: "billing.view", label: "View invoices" },
        { id: "billing.manage", label: "Manage subscriptions" },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      children: [
        { id: "settings.read", label: "Read", defaultChecked: true },
        { id: "settings.write", label: "Write" },
      ],
    },
  ],
};

function TreeNodeRenderer({
  node,
  checked,
  onCheckedChange,
  children,
  depth = 0,
}: {
  node: { id: string; label: string };
  checked: boolean | "indeterminate";
  onCheckedChange: () => void;
  children: React.ReactNode;
  depth?: number;
}) {
  return (
    <div style={{ paddingLeft: `${depth * 20}px` }}>
      <div className="flex items-center gap-2 py-1">
        <Checkbox
          checked={checked === true}
          id={node.id}
          indeterminate={checked === "indeterminate"}
          onCheckedChange={onCheckedChange}
        />
        <label className="cursor-pointer select-none text-sm" htmlFor={node.id}>
          {node.label}
        </label>
      </div>
      {children}
    </div>
  );
}

export default function CheckboxTreeDemo() {
  return (
    <div className="w-72 rounded-md border p-4">
      <CheckboxTree
        renderNode={({ node, checked, onCheckedChange, children }) => (
          <TreeNodeRenderer
            checked={checked}
            key={node.id}
            node={node}
            onCheckedChange={onCheckedChange}
          >
            {children}
          </TreeNodeRenderer>
        )}
        tree={PERMISSIONS_TREE}
      />
    </div>
  );
}
