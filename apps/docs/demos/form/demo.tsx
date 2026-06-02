"use client";

import { Button } from "@strait/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@strait/ui/components/form";
import { Input } from "@strait/ui/components/input";
import { useForm } from "@tanstack/react-form";

export default function FormDemo() {
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: () => undefined,
  });

  return (
    <Form form={form}>
      <form
        className="flex w-80 flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
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
              <FormDescription>We will never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          validators={{
            onSubmit: ({ value }) => (value ? undefined : "Email is required."),
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
