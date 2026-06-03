import {
  Globe02Icon,
  Key01Icon,
  ServerStackIcon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@strait/ui/components/card";
import { ConfigRow } from "@strait/ui/components/config-row";

export default function ConfigRowDemo() {
  return (
    <Card className="w-96">
      <CardContent className="divide-y px-0">
        <ConfigRow
          className="px-4 py-3"
          icon={ServerStackIcon}
          label="Region"
          value="us-east-1"
        />
        <ConfigRow
          className="px-4 py-3"
          description="Where your workloads run"
          icon={Globe02Icon}
          label="Environment"
          value="production"
        />
        <ConfigRow
          className="px-4 py-3"
          icon={Key01Icon}
          label="API Key"
          value="sk-••••••••4f9a"
        />
      </CardContent>
    </Card>
  );
}
