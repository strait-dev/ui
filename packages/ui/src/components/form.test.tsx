import { useForm } from "@tanstack/react-form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

type TestFields = { email: string };

function TestForm({
  onSubmit = vi.fn(),
  defaultValues = { email: "" },
}: {
  onSubmit?: (data: TestFields) => void;
  defaultValues?: TestFields;
}) {
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <Form form={form}>
      <form
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
                  <input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                    value={field.state.value}
                  />
                }
              />
              <FormDescription>We will never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("renders FormItem with form-item data-slot", () => {
    const { container } = render(<TestForm />);
    expect(
      container.querySelector("[data-slot='form-item']")
    ).toBeInTheDocument();
  });

  it("renders FormLabel with form-label data-slot linked to the control", () => {
    render(<TestForm />);
    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("data-slot", "form-label");
    // In the DOM the React htmlFor prop becomes the "for" attribute.
    const input = screen.getByRole("textbox");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("renders FormDescription with form-description data-slot", () => {
    render(<TestForm />);
    const desc = screen.getByText("We will never share your email.");
    expect(desc).toHaveAttribute("data-slot", "form-description");
  });

  it("wires aria-describedby on the control to the description id", () => {
    render(<TestForm />);
    const input = screen.getByRole("textbox");
    const desc = screen.getByText("We will never share your email.");
    expect(input).toHaveAttribute("aria-describedby", desc.id);
  });

  it("renders FormMessage with form-message data-slot on validation error", async () => {
    function ErrorForm() {
      const form = useForm({
        defaultValues: { email: "" },
        onSubmit: () => {
          // no-op
        },
      });

      return (
        <Form form={form}>
          <form
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
                      <input
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="email"
                        value={field.state.value}
                      />
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
              validators={{
                onSubmit: ({ value }) =>
                  value ? undefined : "Email is required",
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </Form>
      );
    }

    render(<ErrorForm />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    const message = await screen.findByText("Email is required");
    expect(message).toHaveAttribute("data-slot", "form-message");
  });

  it("accepts user input via the FormControl rendered element", async () => {
    render(<TestForm />);
    const input = screen.getByRole<HTMLInputElement>("textbox");
    await userEvent.type(input, "test@example.com");
    expect(input).toHaveValue("test@example.com");
  });
});
