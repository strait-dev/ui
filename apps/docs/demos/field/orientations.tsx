import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@strait/ui/components/field";
import { Input } from "@strait/ui/components/input";

export default function FieldOrientations() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div>
        <p className="mb-2 text-muted-foreground text-xs">Vertical (default)</p>
        <Field orientation="vertical">
          <FieldLabel htmlFor="vert-name">Full name</FieldLabel>
          <Input id="vert-name" placeholder="Jane Doe" />
          <FieldDescription>Stacks label above the control.</FieldDescription>
        </Field>
      </div>

      <div>
        <p className="mb-2 text-muted-foreground text-xs">Horizontal</p>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="horiz-name">Full name</FieldLabel>
          <Input id="horiz-name" placeholder="Jane Doe" />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-muted-foreground text-xs">Responsive</p>
        <Field orientation="responsive">
          <FieldLabel htmlFor="resp-name">Full name</FieldLabel>
          <Input id="resp-name" placeholder="Jane Doe" />
          <FieldDescription>
            Vertical on small screens, horizontal on wider viewports.
          </FieldDescription>
        </Field>
      </div>
    </div>
  );
}
