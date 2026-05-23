import { Mail01Icon, Search01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A single-line text input that wraps the Base UI `Input` primitive.",
          "",
          "It inherits all native `<input>` attributes — pass `type`, `placeholder`,",
          "`disabled`, `required`, `aria-invalid`, etc. directly as props.",
          "",
          "Style states are driven by CSS: `disabled` reduces opacity and blocks",
          "interaction; `aria-invalid={true}` switches the border/ring to destructive.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "url", "tel"],
      description: "HTML input type.",
      table: { defaultValue: { summary: "text" } },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the field is empty.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input and prevents interaction.",
    },
    required: {
      control: "boolean",
      description: "Marks the field as required.",
    },
  },
  args: {
    placeholder: "Type something…",
    type: "text",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — use the controls panel to adjust props. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** Default state with a placeholder. */
export const Default: Story = {
  args: { placeholder: "Enter your name" },
};

/** Disabled state — grayed out and non-interactive. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Cannot edit this" },
};

/** Invalid state — border and ring switch to destructive red. */
export const Invalid: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="invalid-empty">Email</Label>
        <Input
          {...args}
          aria-invalid
          id="invalid-empty"
          placeholder="you@example.com"
          type="email"
        />
        <p className="text-destructive text-sm">Please enter a valid email.</p>
      </div>
    </div>
  ),
};

/** A pre-filled input. */
export const WithValue: Story = {
  args: { defaultValue: "John Appleseed" },
};

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** Common input types. */
export const Types: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      {(
        [
          { type: "text", placeholder: "Full name" },
          { type: "email", placeholder: "you@example.com" },
          { type: "password", placeholder: "••••••••" },
          { type: "number", placeholder: "42" },
          { type: "search", placeholder: "Search…" },
          { type: "url", placeholder: "https://example.com" },
          { type: "tel", placeholder: "+1 (555) 000-0000" },
        ] as const
      ).map(({ type, placeholder }) => (
        <div className="flex flex-col gap-1.5" key={type}>
          <Label htmlFor={`type-${type}`}>{type}</Label>
          <Input
            {...args}
            id={`type-${type}`}
            placeholder={placeholder}
            type={type}
          />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Compositions                                                        */
/* ------------------------------------------------------------------ */

/** Always pair an `Input` with a `Label` for full accessibility. */
export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="name-field">Full name</Label>
      <Input {...args} id="name-field" placeholder="Jane Doe" type="text" />
    </div>
  ),
};

/** Label + helper text + error message — a complete field layout. */
export const WithHelperAndError: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-helper">Email address</Label>
        <Input
          {...args}
          id="email-helper"
          placeholder="you@example.com"
          type="email"
        />
        <p className="text-muted-foreground text-sm">
          We'll never share your email.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-error">Email address</Label>
        <Input
          {...args}
          aria-invalid
          id="email-error"
          placeholder="you@example.com"
          type="email"
        />
        <p className="text-destructive text-sm">Please enter a valid email.</p>
      </div>
    </div>
  ),
};

/** Inline decorators built with a wrapping flex container + icons. */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="search-icon">Search</Label>
        <div className="relative">
          <HugeiconsIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            icon={Search01Icon}
          />
          <Input
            {...args}
            className="pl-8"
            id="search-icon"
            placeholder="Search…"
            type="search"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-icon">Email</Label>
        <div className="relative">
          <HugeiconsIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            icon={Mail01Icon}
          />
          <Input
            {...args}
            className="pl-8"
            id="email-icon"
            placeholder="you@example.com"
            type="email"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="user-icon">Username</Label>
        <div className="relative">
          <HugeiconsIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            icon={UserIcon}
          />
          <Input
            {...args}
            className="pl-8"
            id="user-icon"
            placeholder="johndoe"
            type="text"
          />
        </div>
      </div>
    </div>
  ),
};
