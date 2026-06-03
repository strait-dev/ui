import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@strait/ui/components/tabs";

export default function TabsDemo() {
  return (
    <Tabs className="w-full max-w-md" defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="mt-2 text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="mt-2 text-muted-foreground text-sm">
          Change your password and security options.
        </p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="mt-2 text-muted-foreground text-sm">
          Configure how and when you receive notifications.
        </p>
      </TabsContent>
    </Tabs>
  );
}
