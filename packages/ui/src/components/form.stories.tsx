import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FC } from "react";
import { useForm } from "react-hook-form";

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
  // Form is react-hook-form's FormProvider (all props required); cast so the
  // render-only stories don't each have to supply a full form context as args.
  component: Form as FC,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A thin wrapper around **react-hook-form**.",
          "",
          "- `Form` is `FormProvider` — pass your `useForm()` return value as props via spread.",
          "- `FormField` wraps `Controller` and injects field context.",
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

/* ------------------------------------------------------------------ */
/* Playground — simple sign-up form                                   */
/* ------------------------------------------------------------------ */

type SignUpValues = {
  username: string;
  email: string;
  bio: string;
  role: string;
  terms: boolean;
};

function SignUpForm() {
  const form = useForm<SignUpValues>({
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      role: "",
      terms: false,
    },
  });

  function onSubmit(values: SignUpValues) {
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-md flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Username</FormLabel>
              <FormControl
                render={<Input placeholder="johndoe" />}
                {...field}
              />
              <FormDescription>
                This will be your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: "Username is required." }}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl
                render={<Input placeholder="you@example.com" type="email" />}
                {...field}
              />
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{
            required: "Email is required.",
            pattern: {
              value: /^[^@]+@[^@]+\.[^@]+$/,
              message: "Please enter a valid email.",
            },
          }}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl
                render={
                  <Textarea
                    placeholder="Tell us a bit about yourself…"
                    rows={3}
                  />
                }
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
          rules={{ required: "Please select a role." }}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3">
              <FormControl
                render={
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
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
          rules={{ required: "You must accept the terms." }}
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

type LoginValues = { email: string; password: string };

function LoginWithErrors() {
  const form = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  // Pre-set errors to demonstrate the error state in the story
  const { setError } = form;
  const hasSetErrors = form.formState.errors.email;

  function onSubmit() {
    setError("email", { message: "No account found with this email." });
    setError("password", { message: "Password is incorrect." });
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl
                render={<Input placeholder="you@example.com" type="email" />}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl
                render={<Input placeholder="••••••••" type="password" />}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" variant="default">
          {hasSetErrors ? "Try again" : "Sign in (click to show errors)"}
        </Button>
      </form>
    </Form>
  );
}

/** Submit triggers server-side validation errors on both fields. */
export const WithValidationErrors: Story = {
  render: () => <LoginWithErrors />,
};
