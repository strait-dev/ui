"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  type AnyFieldApi,
  type AnyFormApi,
  Field as TanStackField,
} from "@tanstack/react-form";
import type * as React from "react";
import { createContext, useContext, useId } from "react";

import { cn } from "../utils/index";
import { Label } from "./label";

/**
 * Internal context carrying the active TanStack `form` instance so that
 * {@link FormField} can resolve it without prop drilling.
 */
const FormContext = createContext<AnyFormApi | null>(null);

/** Props for {@link Form}. */
export type FormProps = {
  /** The instance returned by `useForm()`. */
  form: AnyFormApi;
  /** Form content — typically a `<form>` element containing {@link FormField}s. */
  children: React.ReactNode;
};

/**
 * Root provider for a `@tanstack/react-form` managed form.
 *
 * Pass the instance returned by `useForm()` via the `form` prop. All
 * descendant {@link FormField} components read it from context, so you only
 * wire the form up once.
 *
 * @remarks
 * `Form` renders no DOM of its own — wrap your own `<form>` element inside it
 * and call `form.handleSubmit()` from its `onSubmit` handler.
 *
 * @example
 * ```tsx
 * const form = useForm({
 *   defaultValues: { email: "" },
 *   onSubmit: ({ value }) => save(value),
 * });
 * return (
 *   <Form form={form}>
 *     <form
 *       onSubmit={(e) => {
 *         e.preventDefault();
 *         form.handleSubmit();
 *       }}
 *     >
 *       …
 *     </form>
 *   </Form>
 * );
 * ```
 */
function Form({ form, children }: FormProps) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

/** Read the enclosing {@link Form}'s TanStack instance. */
function useFormRoot(): AnyFormApi {
  const form = useContext(FormContext);
  if (!form) {
    throw new Error("Form components must be used within <Form>");
  }
  return form;
}

/**
 * Render-prop payload handed to {@link FormField}'s `render`/`children`.
 *
 * `field` is the TanStack field API: read `field.state.value`, write with
 * `field.handleChange`, and flag blur with `field.handleBlur`.
 */
type FormFieldRenderApi = { field: AnyFieldApi };

/**
 * Internal context carrying the active field API so {@link useFormField} (and
 * the sub-components that call it) can read validation state.
 */
const FormFieldContext = createContext<{ field: AnyFieldApi } | null>(null);

/** All props accepted by TanStack's standalone `Field` component. */
type TanStackFieldProps = React.ComponentProps<typeof TanStackField>;

/**
 * Props for {@link FormField}.
 *
 * Inherits every TanStack `Field` option (`validators`, `mode`,
 * `asyncDebounceMs`, `listeners`, …) except `form` (resolved from context) and
 * `children` (replaced with the design-system render contract below).
 */
type FormFieldProps = Omit<TanStackFieldProps, "form" | "name" | "children"> & {
  /** Dot-path of the field within the form's values. */
  name: string;
  /** Render the control. Receives the TanStack `field` API. */
  render?: (api: FormFieldRenderApi) => React.ReactNode;
  /** Alternative to `render`: a node or a render function. */
  children?: React.ReactNode | ((api: FormFieldRenderApi) => React.ReactNode);
};

/**
 * Connects a single `@tanstack/react-form` field to the design-system form
 * components.
 *
 * Wraps TanStack's standalone `Field` and publishes its API through context so
 * {@link useFormField} (and every sub-component that calls it) can read
 * validation state without prop drilling.
 *
 * @remarks
 * Every field in a {@link Form} should be wrapped in a `FormField`. The
 * `render` prop receives `{ field }` and should render the control inside
 * {@link FormItem} → {@link FormControl} for full accessibility wiring.
 *
 * @example
 * ```tsx
 * <FormField
 *   name="email"
 *   validators={{
 *     onChange: ({ value }) => (value ? undefined : "Email is required"),
 *   }}
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <FormControl
 *         render={
 *           <Input
 *             onBlur={field.handleBlur}
 *             onChange={(e) => field.handleChange(e.target.value)}
 *             type="email"
 *             value={field.state.value}
 *           />
 *         }
 *       />
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 * ```
 */
function FormField({ name, render, children, ...fieldProps }: FormFieldProps) {
  const form = useFormRoot();

  return (
    <TanStackField form={form} name={name} {...fieldProps}>
      {(field: AnyFieldApi) => (
        <FormFieldContext.Provider value={{ field }}>
          {renderFieldContent({ field }, render, children)}
        </FormFieldContext.Provider>
      )}
    </TanStackField>
  );
}

/** Resolve a {@link FormField}'s body from its `render`/`children` props. */
function renderFieldContent(
  api: FormFieldRenderApi,
  render: FormFieldProps["render"],
  children: FormFieldProps["children"]
): React.ReactNode {
  if (typeof children === "function") {
    return children(api);
  }
  if (render) {
    return render(api);
  }
  return children;
}

/**
 * Normalise a TanStack validation error into a display string.
 *
 * Errors may be plain strings (function validators) or objects with a
 * `message` property (standard-schema validators). Anything else yields
 * `undefined` so {@link FormMessage} can fall back to its children.
 */
function getFieldErrorMessage(error: unknown): string | undefined {
  if (!error) {
    return;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && "message" in error) {
    const { message } = error as { message?: unknown };
    return typeof message === "string" ? message : undefined;
  }
  return;
}

/**
 * Hook that returns the current field's metadata and validation state.
 *
 * Must be called inside a component rendered within {@link FormField}.
 * Returns `id`, `name`, the three stable element IDs, plus the field's
 * `errors` array, the first `errorMessage`, `isTouched`, and `isInvalid`.
 *
 * @throws when called outside a {@link FormField} context.
 */
const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { field } = fieldContext;
  const { id } = itemContext;
  const { errors, isTouched } = field.state.meta;
  const isInvalid = errors.length > 0;

  return {
    id,
    name: field.name,
    isTouched,
    isInvalid,
    errors,
    errorMessage: getFieldErrorMessage(errors[0]),
    // Stable IDs for htmlFor / aria-describedby / aria-errormessage
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  };
};

/**
 * Internal context value generated by {@link FormItem} so that sibling
 * sub-components share a stable auto-generated ID prefix.
 */
type FormItemContextValue = {
  id: string;
};

// Private context — exposes the shared ID to FormLabel/Control/etc.
const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

/**
 * Layout wrapper for a single form field row.
 *
 * Generates a stable `id` prefix (via `useId`) and shares it through
 * context so {@link FormLabel}, {@link FormControl}, {@link FormDescription},
 * and {@link FormMessage} can wire up matching `htmlFor` /
 * `aria-describedby` attributes without manual IDs.
 *
 * @remarks
 * Always nest `FormItem` inside {@link FormField}. Place
 * {@link FormLabel}, {@link FormControl}, {@link FormDescription}, and
 * {@link FormMessage} as direct children in that order.
 */
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  // useId ensures a stable, collision-free prefix for all sibling IDs.
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        className={cn("flex flex-col gap-2", className)}
        data-slot="form-item"
        {...props}
      />
    </FormItemContext.Provider>
  );
}

/**
 * Label for a form field inside {@link FormItem}.
 *
 * Automatically sets `htmlFor` to the matching {@link FormControl} `id`
 * and turns destructive red when the field has a validation error.
 *
 * @remarks
 * Pass `required` to render a small red asterisk after the label text.
 */
function FormLabel({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<"label"> & { required?: boolean }) {
  const { isInvalid, formItemId } = useFormField();

  return (
    <Label
      // Turn label red when the field is in an error state
      className={cn(isInvalid ? "text-destructive" : null, className)}
      data-slot="form-label"
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {required ? <span className="ml-0.5 text-destructive">*</span> : null}
    </Label>
  );
}

/**
 * Accessibility wrapper that binds a form control to its label, description,
 * and error message via ARIA attributes.
 *
 * Uses Base UI's `useRender` so the `render` prop can project the behavior
 * onto any element (e.g. `render={<Input />}`). The wrapper sets
 * `id`, `aria-invalid`, and `aria-describedby` automatically from the
 * enclosing {@link FormField} / {@link FormItem} context.
 *
 * @remarks
 * When the field has an error, `aria-describedby` includes both the
 * {@link FormDescription} and {@link FormMessage} IDs so screen readers
 * announce both the hint and the error.
 */
function FormControl({
  render,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) {
  const { isInvalid, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return useRender({
    render,
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        // Include formMessageId in describedby only when there is an error
        "aria-describedby": isInvalid
          ? `${formDescriptionId} ${formMessageId}`
          : `${formDescriptionId}`,
        "aria-invalid": isInvalid,
        id: formItemId,
      },
      props
    ),
    state: {
      slot: "form-control",
    },
  });
}

/**
 * Muted helper text for a form field inside {@link FormItem}.
 *
 * Automatically receives the `id` that {@link FormControl} references in
 * `aria-describedby`, ensuring screen readers announce the hint.
 */
function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="form-description"
      id={formDescriptionId}
      {...props}
    />
  );
}

/**
 * Validation error message for a form field inside {@link FormItem}.
 *
 * Shows the field's first error message when present; falls back to explicit
 * `children`. Renders nothing when there is no message. The element's `id` is
 * referenced by {@link FormControl}'s `aria-describedby` on error so screen
 * readers announce the message.
 */
function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { errorMessage, formMessageId } = useFormField();
  // Prefer the field's error message; fall back to explicit children.
  const body = errorMessage ?? children;

  if (!body) {
    return null;
  }

  return (
    <p
      className={cn("font-medium text-destructive text-sm", className)}
      data-slot="form-message"
      id={formMessageId}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  type FormFieldProps,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
