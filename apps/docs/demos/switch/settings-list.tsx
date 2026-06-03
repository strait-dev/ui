import { Label } from "@strait/ui/components/label";
import { Switch } from "@strait/ui/components/switch";

const settings = [
  {
    id: "notif",
    label: "Push notifications",
    desc: "Receive alerts on your devices.",
    defaultChecked: true,
  },
  {
    id: "email",
    label: "Email digest",
    desc: "Weekly summary of activity.",
    defaultChecked: false,
  },
  {
    id: "analytics",
    label: "Analytics sharing",
    desc: "Help us improve the product.",
    defaultChecked: true,
  },
];

export default function SwitchSettingsList() {
  return (
    <div className="flex w-80 flex-col gap-4">
      {settings.map((s) => (
        <div className="flex items-center justify-between gap-4" key={s.id}>
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={s.id}>{s.label}</Label>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </div>
          <Switch defaultChecked={s.defaultChecked} id={s.id} />
        </div>
      ))}
    </div>
  );
}
