import { Button } from "@strait/ui/components/button";
import { Spinner } from "@strait/ui/components/spinner";

export default function ButtonLoading() {
  return (
    <Button disabled>
      <Spinner data-icon="inline-start" />
      Saving…
    </Button>
  );
}
