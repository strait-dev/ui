import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";
import { Input } from "./input";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

const meta = {
  title: "Forms/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A composable field layout system. `Field` is the row wrapper, and its",
          "sub-components provide the label, description, and error.",
          "",
          "**Orientation**",
          "- `vertical` (default) — label stacks above the control.",
          "- `horizontal` — label sits beside the control.",
          "- `responsive` — vertical on small screens, horizontal on `md+`.",
          "",
          "**Key sub-components**",
          "- `FieldLabel` — wraps `Label`, auto-connects to the nearby control.",
          "- `FieldTitle` — plain text title without the `<label>` semantics.",
          "- `FieldDescription` — helper / hint text (muted).",
          "- `FieldError` — validation error (destructive). Hidden when empty.",
          "- `FieldGroup` / `FieldSet` / `FieldLegend` — group multiple fields.",
          "- `FieldSeparator` — horizontal rule between sections.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal", "responsive"],
      description: "Direction of the label–control layout.",
      table: { defaultValue: { summary: "vertical" } },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
      description:
        "Spacing size that cascades to label, description, and control via data-size.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    orientation: "vertical",
    size: "default",
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Basic vertical field — label above input. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <Field {...args}>
        <FieldLabel htmlFor="pg-name">Full name</FieldLabel>
        <Input id="pg-name" placeholder="Jane Doe" />
      </Field>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** `sm`, `default`, and `lg` spacing sizes — cascades to label and description. */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size}>
          <p className="mb-2 font-medium text-muted-foreground text-xs capitalize">
            {size}
          </p>
          <Field size={size}>
            <FieldLabel htmlFor={`sz-${size}-name`}>Full name</FieldLabel>
            <Input id={`sz-${size}-name`} placeholder="Jane Doe" />
            <FieldDescription>
              Enter your legal first and last name.
            </FieldDescription>
          </Field>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Orientations                                                        */
/* ------------------------------------------------------------------ */

/** All three orientations side by side. */
export const Orientations: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs">
          Vertical (default)
        </p>
        <Field orientation="vertical">
          <FieldLabel htmlFor="vert-name">Full name</FieldLabel>
          <Input id="vert-name" placeholder="Jane Doe" />
        </Field>
      </div>

      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs">
          Horizontal
        </p>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="horiz-name">Full name</FieldLabel>
          <Input id="horiz-name" placeholder="Jane Doe" />
        </Field>
      </div>

      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs">
          Responsive
        </p>
        <Field orientation="responsive">
          <FieldLabel htmlFor="resp-name">Full name</FieldLabel>
          <Input id="resp-name" placeholder="Jane Doe" />
        </Field>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* With helper text and error                                          */
/* ------------------------------------------------------------------ */

/** Field with description and error message. */
export const WithDescriptionAndError: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="desc-email">Email</FieldLabel>
        <Input id="desc-email" placeholder="you@example.com" type="email" />
        <FieldDescription>We'll never share your email.</FieldDescription>
      </Field>

      <Field data-invalid="true">
        <FieldLabel htmlFor="err-email">Email</FieldLabel>
        <Input
          aria-invalid
          id="err-email"
          placeholder="you@example.com"
          type="email"
        />
        <FieldDescription>We'll never share your email.</FieldDescription>
        <FieldError>Please enter a valid email address.</FieldError>
      </Field>
    </div>
  ),
};

/** `FieldError` rendering multiple validation messages as a list. */
export const MultipleErrors: Story = {
  render: () => (
    <div className="w-80">
      <Field data-invalid="true">
        <FieldLabel htmlFor="multi-err-pw">Password</FieldLabel>
        <Input
          aria-invalid
          id="multi-err-pw"
          placeholder="••••••••"
          type="password"
        />
        <FieldError
          errors={[
            { message: "Must be at least 8 characters." },
            { message: "Must contain an uppercase letter." },
            { message: "Must contain a number." },
          ]}
        />
      </Field>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Checkbox / Switch fields                                            */
/* ------------------------------------------------------------------ */

/** Checkbox with content-based label. */
export const CheckboxField: Story = {
  render: () => (
    <div className="w-80">
      <Field orientation="horizontal">
        <Checkbox id="terms" />
        <FieldContent>
          <FieldTitle>Accept terms and conditions</FieldTitle>
          <FieldDescription>
            You agree to our{" "}
            <a
              href="https://example.com/terms"
              rel="noreferrer"
              target="_blank"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="https://example.com/privacy"
              rel="noreferrer"
              target="_blank"
            >
              Privacy Policy
            </a>
            .
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

/** Switch with a title + description beside it. */
export const SwitchField: Story = {
  render: () => (
    <div className="w-80">
      <Field orientation="horizontal">
        <Switch id="marketing" />
        <FieldContent>
          <FieldTitle>Marketing emails</FieldTitle>
          <FieldDescription>
            Receive emails about new products and features.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* FieldGroup / FieldSet with separator                                */
/* ------------------------------------------------------------------ */

/** A grouped set of fields with a legend and separator. */
export const GroupedFields: Story = {
  render: () => (
    <div className="w-96">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Personal information</FieldLegend>
          <Field>
            <FieldLabel htmlFor="g-first">First name</FieldLabel>
            <Input id="g-first" placeholder="Jane" />
          </Field>
          <Field>
            <FieldLabel htmlFor="g-last">Last name</FieldLabel>
            <Input id="g-last" placeholder="Doe" />
          </Field>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Account details</FieldLegend>
          <Field>
            <FieldLabel htmlFor="g-email">Email</FieldLabel>
            <Input id="g-email" placeholder="you@example.com" type="email" />
          </Field>
          <Field>
            <FieldLabel htmlFor="g-bio">Bio</FieldLabel>
            <Textarea
              id="g-bio"
              placeholder="Tell us about yourself…"
              rows={3}
            />
          </Field>
        </FieldSet>
      </FieldGroup>
    </div>
  ),
};

/** Separator with text label between two sections. */
export const SeparatorWithLabel: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="sep-email">Email</FieldLabel>
        <Input id="sep-email" placeholder="you@example.com" type="email" />
      </Field>
      <FieldSeparator>or</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="sep-phone">Phone</FieldLabel>
        <Input id="sep-phone" placeholder="+1 (555) 000-0000" type="tel" />
      </Field>
    </div>
  ),
};

/** A radio group inside a FieldSet. */
export const RadioFieldSet: Story = {
  render: () => (
    <div className="w-80">
      <FieldSet>
        <FieldLegend>Preferred contact method</FieldLegend>
        <RadioGroup defaultValue="email">
          <Field orientation="horizontal">
            <RadioGroupItem id="contact-email" value="email" />
            <FieldContent>
              <FieldTitle>Email</FieldTitle>
              <FieldDescription>Get responses in your inbox.</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem id="contact-sms" value="sms" />
            <FieldContent>
              <FieldTitle>SMS</FieldTitle>
              <FieldDescription>
                Get a text message on your phone.
              </FieldDescription>
            </FieldContent>
          </Field>
        </RadioGroup>
      </FieldSet>
    </div>
  ),
};
