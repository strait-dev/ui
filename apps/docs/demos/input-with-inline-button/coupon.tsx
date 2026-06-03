import { InputWithInlineButton } from "@strait/ui/components/input-with-inline-button";
import { Label } from "@strait/ui/components/label";

export default function InputWithInlineButtonCoupon() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inline-btn-coupon">Coupon code</Label>
      <InputWithInlineButton
        buttonText="Apply"
        buttonType="button"
        id="inline-btn-coupon"
        placeholder="SAVE20"
        type="text"
      />
    </div>
  );
}
