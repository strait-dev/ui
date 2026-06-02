import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@strait/ui/components/badge";

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge iconLeft={CheckmarkCircle02Icon} variant="success-light">
        Completed
      </Badge>
      <Badge iconLeft={InformationCircleIcon} variant="info-light">
        Information
      </Badge>
      <Badge iconLeft={Alert02Icon} variant="warning-light">
        Warning
      </Badge>
      <Badge iconLeft={Cancel01Icon} variant="destructive-light">
        Error
      </Badge>
      <Badge iconRight={CheckmarkCircle02Icon} variant="secondary">
        Verified
      </Badge>
    </div>
  );
}
