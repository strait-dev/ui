import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@strait/ui/components/field";
import { Input } from "@strait/ui/components/input";
import { Textarea } from "@strait/ui/components/textarea";

export default function FieldGrouped() {
  return (
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
  );
}
