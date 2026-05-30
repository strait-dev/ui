"use client";

/**
 * IMPORTANT: This component was built for demo purposes only and has not been tested in production.
 * It serves as a proof of concept for a checkbox tree implementation.
 * If you&lsquo;re interested in collaborating to create a more robust, production-ready
 * headless component, your contributions are welcome!
 */

import { useCallback, useMemo, useState } from "react";

/**
 * A single node in the checkbox tree data model.
 *
 * Set `defaultChecked` to pre-select a node on mount. Nest
 * `children` to build branch nodes; leaf nodes omit `children`.
 */
type TreeNode = {
  id: string;
  label: string;
  defaultChecked?: boolean;
  children?: TreeNode[];
};

/**
 * Internal hook that manages checked state for a {@link CheckboxTree}.
 *
 * Returns `isChecked` (which returns `true`, `false`, or
 * `"indeterminate"` for branch nodes with partial selections) and
 * `handleCheck` for toggling a node and all its descendants.
 */
function useCheckboxTree(initialTree: TreeNode) {
  const initialCheckedNodes = useMemo(() => {
    const checkedSet = new Set<string>();
    const initializeCheckedNodes = (node: TreeNode) => {
      if (node.defaultChecked) {
        checkedSet.add(node.id);
      }
      for (const child of node.children || []) {
        initializeCheckedNodes(child);
      }
    };
    initializeCheckedNodes(initialTree);
    return checkedSet;
  }, [initialTree]);

  const [checkedNodes, setCheckedNodes] =
    useState<Set<string>>(initialCheckedNodes);

  const isChecked = useCallback(
    (node: TreeNode): boolean | "indeterminate" => {
      // Leaf node: checked state comes directly from the Set.
      if (!node.children) {
        return checkedNodes.has(node.id);
      }

      const childrenChecked = node.children.map((child) => isChecked(child));
      // All children checked → parent is checked.
      if (childrenChecked.every((status) => status === true)) {
        return true;
      }
      // At least one child (or grandchild) checked → indeterminate.
      if (
        childrenChecked.some(
          (status) => status === true || status === "indeterminate"
        )
      ) {
        return "indeterminate";
      }
      return false;
    },
    [checkedNodes]
  );

  const handleCheck = useCallback(
    (node: TreeNode) => {
      const newCheckedNodes = new Set(checkedNodes);

      const toggleNode = (n: TreeNode, check: boolean) => {
        if (check) {
          newCheckedNodes.add(n.id);
        } else {
          newCheckedNodes.delete(n.id);
        }
        // Recursively cascade the new state to all descendants.
        for (const child of n.children || []) {
          toggleNode(child, check);
        }
      };

      const currentStatus = isChecked(node);
      // Checked or indeterminate → uncheck; unchecked → check.
      const newCheck = currentStatus !== true;

      toggleNode(node, newCheck);
      setCheckedNodes(newCheckedNodes);
    },
    [checkedNodes, isChecked]
  );

  return { isChecked, handleCheck };
}

/** Props for {@link CheckboxTree}. */
export type CheckboxTreeProps = {
  /** Root {@link TreeNode} whose entire hierarchy is rendered and managed. */
  tree: TreeNode;
  /**
   * Render-prop called for every node in the tree.
   *
   * Receives the node data, its computed tri-state `checked` value,
   * an `onCheckedChange` toggle handler, and already-rendered
   * `children` for branch nodes.
   */
  renderNode: (props: {
    node: TreeNode;
    checked: boolean | "indeterminate";
    onCheckedChange: () => void;
    children: React.ReactNode;
  }) => React.ReactNode;
};

/**
 * A headless, renderless checkbox tree that manages tri-state
 * (checked / unchecked / indeterminate) selection across a nested
 * {@link TreeNode} hierarchy.
 *
 * @remarks
 * Built for demo / proof-of-concept purposes; not hardened for
 * production. State is managed by the internal
 * {@link useCheckboxTree} hook. The component is fully headless —
 * all rendering is delegated to the `renderNode` render-prop,
 * which receives each node, its computed checked state, a toggle
 * handler, and already-rendered children.
 *
 * Checking a branch node cascades the new state down to all
 * descendants; a branch with only some descendants checked shows
 * as `"indeterminate"`.
 *
 * @example
 * ```tsx
 * <CheckboxTree
 *   tree={treeData}
 *   renderNode={({ node, checked, onCheckedChange, children }) => (
 *     <div key={node.id}>
 *       <Checkbox
 *         checked={checked}
 *         onCheckedChange={onCheckedChange}
 *         label={node.label}
 *       />
 *       <div className="pl-4">{children}</div>
 *     </div>
 *   )}
 * />
 * ```
 */
export function CheckboxTree({ tree, renderNode }: CheckboxTreeProps) {
  const { isChecked, handleCheck } = useCheckboxTree(tree);

  const renderTreeNode = (node: TreeNode): React.ReactNode => {
    const children = node.children?.map(renderTreeNode);

    return renderNode({
      node,
      checked: isChecked(node),
      onCheckedChange: () => handleCheck(node),
      children,
    });
  };

  return renderTreeNode(tree);
}
