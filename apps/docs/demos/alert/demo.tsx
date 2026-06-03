import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@strait/ui/components/alert";

export default function AlertDemo() {
  return (
    <Alert variant="info">
      <HugeiconsIcon icon={InformationCircleIcon} />
      <AlertTitle>New feature available</AlertTitle>
      <AlertDescription>
        The redesigned dashboard is now available. Try it out from your account
        settings.
      </AlertDescription>
    </Alert>
  );
}
