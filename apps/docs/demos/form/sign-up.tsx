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
import { Textarea } from "@strait/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";

const EMAIL_RE = /^[^@]+@[^@]+\.[^@]+$/;

export default function FormSignUp() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { username: "", email: "", bio: "" },
    onSubmit: ({ value }) => {
      setSubmitted(JSON.stringify(value, null, 2));
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
              <FormDescription>Your public display name.</FormDescription>
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

        <Button className="w-full" type="submit">
          Create account
        </Button>

        {submitted && (
          <pre className="rounded-lg bg-muted p-3 text-muted-foreground text-xs">
            {submitted}
          </pre>
        )}
      </form>
    </Form>
  );
}
