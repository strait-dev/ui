import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@strait/ui/components/field";
import { Input } from "@strait/ui/components/input";

export default function FieldWithDescriptionAndError() {
  return (
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
  );
}
