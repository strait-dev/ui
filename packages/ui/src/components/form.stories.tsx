import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "@tanstack/react-form";
import type { FC } from "react";

import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Textarea } from "./textarea";

const meta = {
  title: "Forms/Form",
  // Form takes a live `useForm()` instance via the `form` prop; cast so the
  // render-only stories don't each have to supply one as args.
  component: Form as FC,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A thin wrapper around **@tanstack/react-form**.",
          "",
          "- `Form` provides the `useForm()` instance via context — pass it as the `form` prop.",
          "- `FormField` wraps TanStack's `Field` and injects field context.",
          "- `FormItem` provides a unique ID context for label/control/message linkage.",
          "- `FormLabel` auto-associates with the control and turns destructive on error.",
          "- `FormControl` wires `aria-describedby` and `aria-invalid` from field state.",
          "- `FormDescription` renders helper text, linked via `aria-describedby`.",
          "- `FormMessage` renders the validation error (hidden when none).",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<FC>;

export default meta;

type Story = StoryObj<typeof meta>;

const EMAIL_RE = /^[^@]+@[^@]+\.[^@]+$/;

/* ------------------------------------------------------------------ */
/* Playground — simple sign-up form                                   */
/* ------------------------------------------------------------------ */

function SignUpForm() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      role: "",
      terms: false,
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <Form form={form}>
      <form
        className="flex w-full max-w-md flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Username</FormLabel>
              <FormControl
                render={
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="johndoe"
                    value={field.state.value}
                  />
                }
              />
              <FormDescription>
                This will be your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          validators={{
            onSubmit: ({ value }) =>
              value ? undefined : "Username is required.",
          }}
        />

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl
                render={
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={field.state.value}
                  />
                }
              />
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          validators={{
            onSubmit: ({ value }) => {
              if (!value) {
                return "Email is required.";
              }
              return EMAIL_RE.test(String(value))
                ? undefined
                : "Please enter a valid email.";
            },
          }}
        />

        <FormField
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl
                render={
                  <Textarea
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Tell us a bit about yourself…"
                    rows={3}
                    value={field.state.value}
                  />
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Role</FormLabel>
              <Select
                onValueChange={(value) => field.handleChange(value)}
                value={field.state.value}
              >
                <FormControl
                  render={
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  }
                />
                <SelectContent>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
          validators={{
            onSubmit: ({ value }) =>
              value ? undefined : "Please select a role.",
          }}
        />

        <FormField
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3">
              <FormControl
                render={
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                  />
                }
              />
              <div className="flex flex-col gap-1">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
          validators={{
            onSubmit: ({ value }) =>
              value ? undefined : "You must accept the terms.",
          }}
        />

        <Button className="w-full" type="submit">
          Create account
        </Button>
      </form>
    </Form>
  );
}

/** A realistic sign-up form using all form primitives. */
export const Playground: Story = {
  render: () => <SignUpForm />,
};

/* ------------------------------------------------------------------ */
/* Validation states                                                   */
/* ------------------------------------------------------------------ */

function LoginWithErrors() {
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: {
      // Server-style validation that always fails, to showcase error styling.
      onSubmit: () => ({
        fields: {
          email: "No account found with this email.",
          password: "Password is incorrect.",
        },
      }),
    },
    onSubmit: () => {
      // no-op — validation above never passes
    },
  });

  return (
    <Form form={form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl
                render={
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={field.state.value}
                  />
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl
                render={
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    value={field.state.value}
                  />
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" variant="default">
          Sign in (click to show errors)
        </Button>
      </form>
    </Form>
  );
}

/** Submit triggers form-level validation errors on both fields. */
export const WithValidationErrors: Story = {
  render: () => <LoginWithErrors />,
};
