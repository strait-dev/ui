import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@strait/ui/components/alert";
import { Button } from "@strait/ui/components/button";

export default function AlertWithAction() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Alert variant="info">
        <HugeiconsIcon icon={InformationCircleIcon} />
        <AlertTitle>New version available</AlertTitle>
        <AlertDescription>
          Version 3.2.0 is ready to install with performance improvements.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" variant="info-outline">
            Update
          </Button>
        </AlertAction>
      </Alert>

      <Alert variant="success">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} />
        <AlertTitle>Deployment complete</AlertTitle>
        <AlertDescription>
          Your app was deployed to production 2 minutes ago.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" variant="success-outline">
            View logs
          </Button>
        </AlertAction>
      </Alert>

      <Alert variant="warning">
        <HugeiconsIcon icon={Alert02Icon} />
        <AlertTitle>API rate limit approaching</AlertTitle>
        <AlertDescription>
          You have used 90% of your monthly API quota.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" variant="warning-outline">
            Upgrade
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}
