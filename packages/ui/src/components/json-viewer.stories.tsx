import type { Meta, StoryObj } from "@storybook/react-vite";
import { JsonViewer } from "./json-viewer";

const SIMPLE_OBJECT = {
  id: "usr_9f3a1c2b",
  name: "Alice Nguyen",
  active: true,
  score: 98.7,
  notes: null,
};

const NESTED_OBJECT = {
  user: {
    id: "usr_9f3a1c2b",
    profile: {
      name: "Alice Nguyen",
      email: "alice@example.com",
      avatar: null,
    },
    roles: ["admin", "editor"],
    meta: {
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2025-03-22T08:12:00Z",
    },
  },
  pagination: {
    page: 1,
    pageSize: 20,
    total: 142,
    hasNext: true,
  },
};

const ARRAY_DATA = [
  { id: 1, status: "success", value: 100 },
  { id: 2, status: "pending", value: 42 },
  { id: 3, status: "error", value: null },
];

const meta: Meta<typeof JsonViewer> = {
  title: "Data Display/JSON Viewer",
  component: JsonViewer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Hand-rolled recursive, collapsible, colorised JSON tree viewer.",
          "",
          "Renders any JSON-serialisable value without an external highlighting",
          "dependency. Objects and arrays are collapsible; primitives are",
          "colour-coded using semantic design-system tokens:",
          "**strings** → success-accent, **numbers** → info-accent,",
          "**booleans / null** → warning-accent, **keys** → foreground.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    defaultExpanded: {
      control: "number",
      description:
        "Depth to expand on mount. `true` = all, `false` = none, number = levels.",
      table: { defaultValue: { summary: "1" } },
    },
    copyable: {
      control: "boolean",
      description: "Show a clipboard copy button.",
      table: { defaultValue: { summary: "false" } },
    },
    maxHeight: {
      control: "text",
      description: "CSS max-height value or pixel number.",
    },
    rootLabel: {
      control: "text",
      description: "Optional label for the root node.",
    },
  },
  args: {
    data: SIMPLE_OBJECT,
    defaultExpanded: 1,
    copyable: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — swap data and tweak expansion depth. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* Simple object                                                        */
/* ------------------------------------------------------------------ */

/** A flat object with mixed primitive types. */
export const SimpleObject: Story = {
  args: {
    data: SIMPLE_OBJECT,
    defaultExpanded: 1,
  },
};

/* ------------------------------------------------------------------ */
/* Nested object                                                        */
/* ------------------------------------------------------------------ */

/** Deeply nested response — expand by depth with `defaultExpanded`. */
export const NestedObject: Story = {
  args: {
    data: NESTED_OBJECT,
    defaultExpanded: 2,
    copyable: true,
  },
};

/* ------------------------------------------------------------------ */
/* Array of objects                                                     */
/* ------------------------------------------------------------------ */

/** An array of objects — common for API list responses. */
export const ArrayOfObjects: Story = {
  args: {
    data: ARRAY_DATA,
    defaultExpanded: 2,
  },
};

/* ------------------------------------------------------------------ */
/* Fully expanded                                                       */
/* ------------------------------------------------------------------ */

/** All nodes expanded on mount. */
export const FullyExpanded: Story = {
  args: {
    data: NESTED_OBJECT,
    defaultExpanded: true,
  },
};

/* ------------------------------------------------------------------ */
/* Fully collapsed                                                      */
/* ------------------------------------------------------------------ */

/** All nodes collapsed on mount. */
export const FullyCollapsed: Story = {
  args: {
    data: NESTED_OBJECT,
    defaultExpanded: false,
  },
};

/* ------------------------------------------------------------------ */
/* With copy button                                                     */
/* ------------------------------------------------------------------ */

/** Copy button in the top-right corner. */
export const WithCopyButton: Story = {
  args: {
    data: SIMPLE_OBJECT,
    copyable: true,
    defaultExpanded: 1,
  },
};

/* ------------------------------------------------------------------ */
/* Max height with scroll                                               */
/* ------------------------------------------------------------------ */

/** Constrained height — scroll to explore. */
export const MaxHeight: Story = {
  args: {
    data: NESTED_OBJECT,
    defaultExpanded: true,
    maxHeight: 250,
    copyable: true,
  },
};

/* ------------------------------------------------------------------ */
/* Primitive values                                                     */
/* ------------------------------------------------------------------ */

/** Raw primitive values — string, number, boolean, null. */
export const PrimitiveValues: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <JsonViewer data="Hello, world!" rootLabel="string" />
      <JsonViewer data={Math.PI} rootLabel="number" />
      <JsonViewer data={true} rootLabel="boolean" />
      <JsonViewer data={null} rootLabel="null" />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* With root label                                                      */
/* ------------------------------------------------------------------ */

/** Custom root label to name the inspected variable. */
export const WithRootLabel: Story = {
  args: {
    data: SIMPLE_OBJECT,
    rootLabel: "currentUser",
    defaultExpanded: 1,
  },
};
