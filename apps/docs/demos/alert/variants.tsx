import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  MultiplicationSignCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@strait/ui/components/alert";

export default function AlertVariants() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Alert variant="info">
        <HugeiconsIcon icon={InformationCircleIcon} />
        <AlertTitle>Informational</AlertTitle>
        <AlertDescription>
          Your account plan renews on July 1st. Review your usage in settings.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved and are now live.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <HugeiconsIcon icon={Alert02Icon} />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Storage is at 85% capacity. Consider upgrading your plan.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <HugeiconsIcon icon={MultiplicationSignCircleIcon} />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your payment failed. Please update your billing information.
        </AlertDescription>
      </Alert>
    </div>
  );
}
