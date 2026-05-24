import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";
import { CheckboxTree } from "./checkbox-tree";

const meta: Meta<typeof CheckboxTree> = {
  title: "Patterns/Checkbox Tree",
  component: CheckboxTree,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A headless checkbox tree component that manages checked/indeterminate state for nested node hierarchies.",
          "",
          "- `tree` accepts a recursive `TreeNode` object (`id`, `label`, optional `defaultChecked`, optional `children`).",
          "- `renderNode` is a render-prop that receives `{ node, isChecked, onCheckedChange, children }` — you supply the markup.",
          "- Parent nodes show an **indeterminate** state when only some children are checked.",
          "- Checking a parent cascades down to all children; unchecking cascades as well.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

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
  isChecked,
  onCheckedChange,
  children,
  depth = 0,
}: {
  node: { id: string; label: string };
  isChecked: boolean | "indeterminate";
  onCheckedChange: () => void;
  children: React.ReactNode;
  depth?: number;
}) {
  return (
    <div style={{ paddingLeft: `${depth * 20}px` }}>
      <div className="flex items-center gap-2 py-1">
        <Checkbox
          checked={isChecked === true}
          id={node.id}
          indeterminate={isChecked === "indeterminate"}
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

/** Interactive playground — try toggling parent/child nodes. */
export const Playground: Story = {
  render: () => (
    <div className="w-72 rounded-md border p-4">
      <CheckboxTree
        renderNode={({ node, isChecked, onCheckedChange, children }) => (
          <TreeNodeRenderer
            isChecked={isChecked}
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
  ),
};

/** Shallow two-level tree. */
export const ShallowTree: Story = {
  render: () => {
    const SHALLOW_TREE = {
      id: "features",
      label: "Features",
      children: [
        { id: "feat-a", label: "Dark mode", defaultChecked: true },
        { id: "feat-b", label: "Notifications" },
        { id: "feat-c", label: "Analytics" },
      ],
    };
    return (
      <div className="w-60 rounded-md border p-4">
        <CheckboxTree
          renderNode={({ node, isChecked, onCheckedChange, children }) => (
            <TreeNodeRenderer
              isChecked={isChecked}
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
  },
};

/** All nodes pre-checked. */
export const AllChecked: Story = {
  render: () => {
    const ALL_CHECKED_TREE = {
      id: "root",
      label: "All",
      defaultChecked: true,
      children: [
        { id: "a", label: "Option A", defaultChecked: true },
        { id: "b", label: "Option B", defaultChecked: true },
        { id: "c", label: "Option C", defaultChecked: true },
      ],
    };
    return (
      <div className="w-60 rounded-md border p-4">
        <CheckboxTree
          renderNode={({ node, isChecked, onCheckedChange, children }) => (
            <TreeNodeRenderer
              isChecked={isChecked}
              key={node.id}
              node={node}
              onCheckedChange={onCheckedChange}
            >
              {children}
            </TreeNodeRenderer>
          )}
          tree={ALL_CHECKED_TREE}
        />
      </div>
    );
  },
};
