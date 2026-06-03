import { InputPasswordWithStrengthIndicator } from "@strait/ui/components/input-password-with-strength-indicator";

export default function InputPasswordWithStrengthIndicatorDemo() {
  return (
    <div className="w-72">
      <InputPasswordWithStrengthIndicator
        id="strength-demo"
        label="Password"
        placeholder="Create a password"
      />
    </div>
  );
}
