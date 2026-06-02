import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@strait/ui/components/input-otp";
import { Label } from "@strait/ui/components/label";

export default function InputOTPDisabled() {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="otp-disabled">Code (expired)</Label>
      <InputOTP disabled id="otp-disabled" maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
