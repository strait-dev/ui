import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@strait/ui/components/field";
import { Input } from "@strait/ui/components/input";

export default function FieldDemo() {
  return (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="field-email">Email address</FieldLabel>
        <Input id="field-email" placeholder="you@example.com" type="email" />
        <FieldDescription>We will never share your email.</FieldDescription>
      </Field>
    </div>
  );
}
