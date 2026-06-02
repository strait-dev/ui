import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { Label } from "@strait/ui/components/label";
import { Switch } from "@strait/ui/components/switch";

const settings = [
  {
    id: "email-alerts",
    title: "Email alerts",
    description: "Get notified about account activity by email.",
    on: true,
  },
  {
    id: "push",
    title: "Push notifications",
    description: "Receive push notifications on your devices.",
    on: false,
  },
  {
    id: "digest",
    title: "Weekly digest",
    description: "A summary of your activity, every Monday.",
    on: true,
  },
];

export default function SettingsPanelBlock() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose how you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {settings.map((setting) => (
          <div
            className="flex items-center justify-between gap-4"
            key={setting.id}
          >
            <div className="flex flex-col gap-0.5">
              <Label htmlFor={setting.id}>{setting.title}</Label>
              <span className="text-muted-foreground text-sm">
                {setting.description}
              </span>
            </div>
            <Switch defaultChecked={setting.on} id={setting.id} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
