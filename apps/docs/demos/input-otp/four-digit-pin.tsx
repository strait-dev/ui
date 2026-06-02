import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@strait/ui/components/input-otp";
import { Label } from "@strait/ui/components/label";

export default function InputOTPFourDigitPin() {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="otp-pin">PIN</Label>
      <InputOTP id="otp-pin" maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
