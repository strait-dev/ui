import { GlobeIcon, Key01Icon, Timer01Icon } from "@hugeicons/core-free-icons";
import { ConfigRow } from "@strait/ui/components/config-row";

export default function ConfigRowWithIcons() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <ConfigRow icon={GlobeIcon} label="Region" value="us-east-1" />
      <ConfigRow icon={Timer01Icon} label="Retention" value="90 days" />
      <ConfigRow icon={Key01Icon} label="API Key" value="sk-live-••••4f9a" />
    </div>
  );
}
