"use client";

import { Button } from "@strait/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@strait/ui/components/form";
import { Input } from "@strait/ui/components/input";
import { useForm } from "@tanstack/react-form";

export default function FormValidationErrors() {
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: {
      onSubmit: () => ({
        fields: {
          email: "No account found with this email.",
          password: "Password is incorrect.",
        },
      }),
    },
    onSubmit: () => {
      // validation above always fails; no-op here
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
        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </form>
    </Form>
  );
}
