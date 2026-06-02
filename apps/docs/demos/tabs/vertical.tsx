import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@strait/ui/components/tabs";

export default function TabsVertical() {
  return (
    <Tabs className="max-w-lg" defaultValue="general" orientation="vertical">
      <TabsList variant="line">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p className="text-muted-foreground text-sm">
          Update your workspace name, logo, and timezone settings.
        </p>
      </TabsContent>
      <TabsContent value="security">
        <p className="text-muted-foreground text-sm">
          Manage two-factor authentication and active sessions.
        </p>
      </TabsContent>
      <TabsContent value="billing">
        <p className="text-muted-foreground text-sm">
          View invoices, update payment methods, and change your plan.
        </p>
      </TabsContent>
      <TabsContent value="team">
        <p className="text-muted-foreground text-sm">
          Invite members, manage roles, and review pending invitations.
        </p>
      </TabsContent>
    </Tabs>
  );
}
