import {
  GlobeIcon,
  Key01Icon,
  Settings01Icon,
  ShieldKeyIcon,
  Timer01Icon,
} from "@hugeicons/core-free-icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { ConfigRow } from "@strait/ui/components/config-row";
import { CopyButton } from "@strait/ui/components/copy-button";

export default function ConfigRowInCard() {
  return (
    <div className="max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <div className="divide-y">
            <ConfigRow
              className="px-4 py-2.5"
              icon={GlobeIcon}
              label="Region"
              value="us-east-1"
            />
            <ConfigRow
              className="px-4 py-2.5"
              description="How long raw events are stored."
              icon={Timer01Icon}
              label="Retention"
              value="90 days"
            />
            <ConfigRow
              action={
                <CopyButton
                  aria-label="Copy API key"
                  text="sk-live-real-key-here"
                />
              }
              className="px-4 py-2.5"
              icon={Key01Icon}
              label="API Key"
              value="sk-live-••••••••4f9a"
            />
            <ConfigRow
              className="px-4 py-2.5"
              icon={ShieldKeyIcon}
              label="Auth Provider"
              value="GitHub OAuth"
            />
            <ConfigRow
              className="px-4 py-2.5"
              icon={Settings01Icon}
              label="Plan"
              value="Pro"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
