import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@strait/ui/components/input-otp";
import { Label } from "@strait/ui/components/label";

export default function InputOTPEightCharSplit() {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="otp-recovery">Recovery key</Label>
      <InputOTP id="otp-recovery" maxLength={8}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
