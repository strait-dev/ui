import {
  Archive02Icon,
  Delete01Icon,
  Download02Icon,
  Edit01Icon,
} from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { BulkActionBar } from "./bulk-action-bar";

const meta: Meta<typeof BulkActionBar> = {
  title: "Data Display/Bulk Action Bar",
  component: BulkActionBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Floating toolbar that surfaces bulk actions when one or more table or list rows",
          "are selected. Fully presentational — owns no selection state.",
          "",
          "Actions with an `icon` render as icon-only buttons wrapped in a **Tooltip**.",
          "Actions without an `icon` render as labelled buttons. Both accept a `variant`",
          "forwarded to the underlying `Button`.",
          "",
          'Use `position="fixed"` to pin the bar 24 px above the viewport bottom,',
          'horizontally centred. Use `position="static"` (default) when you need to',
          "control placement yourself — e.g. below a data table.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    selectedCount: {
      control: { type: "number", min: 0 },
      description: "Number of selected items shown in the count label.",
      table: { defaultValue: { summary: "0" } },
    },
    position: {
      control: "radio",
      options: ["static", "fixed"],
      description: "Positioning strategy.",
      table: { defaultValue: { summary: "static" } },
    },
    onClearSelection: { action: "onClearSelection" },
  },
  args: {
    selectedCount: 3,
    position: "static",
    actions: [
      { label: "Archive", onClick: () => {} },
      { label: "Delete", variant: "destructive", onClick: () => {} },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — tweak selectedCount, position, and actions. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* Icon actions with tooltips                                          */
/* ------------------------------------------------------------------ */

/**
 * When every action carries an `icon`, the bar renders compact icon-only
 * buttons. Hover over a button to see the tooltip with its label.
 */
export const IconActions: Story = {
  args: {
    selectedCount: 5,
    actions: [
      {
        label: "Edit",
        icon: Edit01Icon,
        onClick: () => {},
      },
      {
        label: "Archive",
        icon: Archive02Icon,
        onClick: () => {},
      },
      {
        label: "Download",
        icon: Download02Icon,
        onClick: () => {},
      },
      {
        label: "Delete",
        icon: Delete01Icon,
        variant: "destructive",
        onClick: () => {},
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Static in a table-selection context                                 */
/* ------------------------------------------------------------------ */

const rows = [
  { id: 1, name: "Alpha" },
  { id: 2, name: "Beta" },
  { id: 3, name: "Gamma" },
  { id: 4, name: "Delta" },
];

/**
 * `position="static"` places the bar inline. Here it sits below a minimal
 * table to illustrate a real table-selection workflow.
 */
export const TableSelectionContext: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<number[]>([]);

    const toggle = (id: number) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    };

    return (
      <div className="flex w-96 flex-col gap-3">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr className="border-b" key={row.id}>
                <td className="py-2 pr-3">
                  <input
                    aria-label={`Select ${row.name}`}
                    checked={selected.includes(row.id)}
                    onChange={() => toggle(row.id)}
                    type="checkbox"
                  />
                </td>
                <td className="py-2">{row.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {selected.length > 0 && (
          <BulkActionBar
            {...args}
            actions={[
              {
                label: "Archive",
                icon: Archive02Icon,
                onClick: () => {},
              },
              {
                label: "Delete",
                icon: Delete01Icon,
                variant: "destructive",
                onClick: () => {},
              },
            ]}
            onClearSelection={() => setSelected([])}
            position="static"
            selectedCount={selected.length}
          />
        )}
      </div>
    );
  },
};
