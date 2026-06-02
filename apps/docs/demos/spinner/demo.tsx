import { Spinner } from "@strait/ui/components/spinner";

export default function SpinnerDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="default" />
      <Spinner size="lg" />
    </div>
  );
}
