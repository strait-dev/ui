"use client";

import { Checkbox } from "@strait/ui/components/checkbox";
import { CheckboxTree } from "@strait/ui/components/checkbox-tree";

const SHALLOW_TREE = {
  id: "features",
  label: "Features",
  children: [
    { id: "feat-dark-mode", label: "Dark mode", defaultChecked: true },
    { id: "feat-notifications", label: "Notifications" },
    { id: "feat-analytics", label: "Analytics" },
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

export default function CheckboxTreeShallow() {
  return (
    <div className="w-60 rounded-md border p-4">
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
        tree={SHALLOW_TREE}
      />
    </div>
  );
}
