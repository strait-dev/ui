import {
  BarChartIcon,
  Settings02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@strait/ui/components/tabs";

export default function TabsWithIcons() {
  return (
    <Tabs className="w-full max-w-md" defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">
          <HugeiconsIcon icon={UserIcon} />
          Profile
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <HugeiconsIcon icon={BarChartIcon} />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="settings">
          <HugeiconsIcon icon={Settings02Icon} />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <p className="mt-2 text-muted-foreground text-sm">
          View and edit your public profile information.
        </p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="mt-2 text-muted-foreground text-sm">
          Track page views, engagement, and growth trends.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="mt-2 text-muted-foreground text-sm">
          Adjust preferences, integrations, and notifications.
        </p>
      </TabsContent>
    </Tabs>
  );
}
