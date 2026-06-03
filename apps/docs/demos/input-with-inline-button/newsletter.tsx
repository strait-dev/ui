import { InputWithInlineButton } from "@strait/ui/components/input-with-inline-button";
import { Label } from "@strait/ui/components/label";

export default function InputWithInlineButtonNewsletter() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inline-btn-newsletter">Newsletter</Label>
      <InputWithInlineButton
        buttonText="Subscribe"
        buttonType="submit"
        id="inline-btn-newsletter"
        placeholder="you@example.com"
        type="email"
      />
    </div>
  );
}
