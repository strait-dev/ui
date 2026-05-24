import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxTree } from "./checkbox-tree";

type TreeNode = {
  id: string;
  label: string;
  defaultChecked?: boolean;
  children?: TreeNode[];
};

/** Minimal renderNode that produces checkboxes + nested children. */
function makeRenderNode() {
  return ({
    node,
    isChecked,
    onCheckedChange,
    children,
  }: {
    node: TreeNode;
    isChecked: boolean | "indeterminate";
    onCheckedChange: () => void;
    children: React.ReactNode;
  }) => (
    <div key={node.id}>
      <input
        aria-checked={
          isChecked === "indeterminate" ? "mixed" : isChecked ? "true" : "false"
        }
        aria-label={node.label}
        checked={isChecked === true}
        data-testid={`node-${node.id}`}
        onChange={onCheckedChange}
        readOnly={isChecked === "indeterminate"}
        type="checkbox"
      />
      <span>{node.label}</span>
      <div>{children}</div>
    </div>
  );
}

const leafTree: TreeNode = { id: "leaf", label: "Leaf Node" };

const simpleTree: TreeNode = {
  id: "root",
  label: "Root",
  children: [
    { id: "child1", label: "Child 1" },
    { id: "child2", label: "Child 2" },
  ],
};

const preCheckedTree: TreeNode = {
  id: "root",
  label: "Root",
  children: [
    { id: "child1", label: "Child 1", defaultChecked: true },
    { id: "child2", label: "Child 2" },
  ],
};

describe("CheckboxTree", () => {
  it("renders a leaf node", () => {
    render(<CheckboxTree renderNode={makeRenderNode()} tree={leafTree} />);
    expect(screen.getByLabelText("Leaf Node")).toBeInTheDocument();
  });

  it("renders all nodes in a tree", () => {
    render(<CheckboxTree renderNode={makeRenderNode()} tree={simpleTree} />);
    expect(screen.getByLabelText("Root")).toBeInTheDocument();
    expect(screen.getByLabelText("Child 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Child 2")).toBeInTheDocument();
  });

  it("starts unchecked by default", () => {
    render(<CheckboxTree renderNode={makeRenderNode()} tree={leafTree} />);
    expect(screen.getByLabelText("Leaf Node")).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("respects defaultChecked on a leaf node", () => {
    const checkedLeaf: TreeNode = {
      id: "checked",
      label: "Checked Leaf",
      defaultChecked: true,
    };
    render(<CheckboxTree renderNode={makeRenderNode()} tree={checkedLeaf} />);
    expect(screen.getByLabelText("Checked Leaf")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("shows parent as indeterminate when only some children are checked", () => {
    render(
      <CheckboxTree renderNode={makeRenderNode()} tree={preCheckedTree} />
    );
    expect(screen.getByLabelText("Root")).toHaveAttribute(
      "aria-checked",
      "mixed"
    );
  });

  it("checks a leaf node on click and calls the renderNode handler", async () => {
    render(<CheckboxTree renderNode={makeRenderNode()} tree={leafTree} />);
    const checkbox = screen.getByLabelText("Leaf Node");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    await userEvent.click(checkbox);
    expect(screen.getByLabelText("Leaf Node")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("unchecks a leaf node on second click", async () => {
    render(<CheckboxTree renderNode={makeRenderNode()} tree={leafTree} />);
    const checkbox = screen.getByLabelText("Leaf Node");
    await userEvent.click(checkbox);
    await userEvent.click(checkbox);
    expect(screen.getByLabelText("Leaf Node")).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("checking parent checks all children", async () => {
    render(<CheckboxTree renderNode={makeRenderNode()} tree={simpleTree} />);
    await userEvent.click(screen.getByLabelText("Root"));
    expect(screen.getByLabelText("Child 1")).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByLabelText("Child 2")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("when all children are checked, parent is also checked", async () => {
    render(<CheckboxTree renderNode={makeRenderNode()} tree={simpleTree} />);
    await userEvent.click(screen.getByLabelText("Child 1"));
    await userEvent.click(screen.getByLabelText("Child 2"));
    expect(screen.getByLabelText("Root")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("calls renderNode with node, isChecked, onCheckedChange, and children", () => {
    const renderNode = vi.fn(
      ({
        node,
        onCheckedChange,
        children,
      }: {
        node: TreeNode;
        isChecked: boolean | "indeterminate";
        onCheckedChange: () => void;
        children: React.ReactNode;
      }) => (
        <div key={node.id}>
          <span>{node.label}</span>
          <button onClick={onCheckedChange} type="button">
            toggle
          </button>
          {children}
        </div>
      )
    );
    render(<CheckboxTree renderNode={renderNode} tree={simpleTree} />);
    // renderNode is called once per node in the tree (root + 2 children = 3)
    expect(renderNode).toHaveBeenCalledTimes(3);
    const firstCall = renderNode.mock.calls[0]?.[0];
    expect(firstCall).toHaveProperty("node");
    expect(firstCall).toHaveProperty("isChecked");
    expect(firstCall).toHaveProperty("onCheckedChange");
    expect(firstCall).toHaveProperty("children");
  });
});
