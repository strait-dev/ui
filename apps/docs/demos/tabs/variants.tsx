import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@strait/ui/components/tabs";

export default function TabsVariants() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          default
        </p>
        <Tabs defaultValue="tab1">
          <TabsList variant="default">
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Analytics</TabsTrigger>
            <TabsTrigger value="tab3">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p className="mt-2 text-muted-foreground text-sm">
              A summary of your project activity.
            </p>
          </TabsContent>
          <TabsContent value="tab2">
            <p className="mt-2 text-muted-foreground text-sm">
              Detailed usage metrics and charts.
            </p>
          </TabsContent>
          <TabsContent value="tab3">
            <p className="mt-2 text-muted-foreground text-sm">
              Manage project configuration.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          line
        </p>
        <Tabs defaultValue="tab1">
          <TabsList variant="line">
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Analytics</TabsTrigger>
            <TabsTrigger value="tab3">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p className="mt-2 text-muted-foreground text-sm">
              A summary of your project activity.
            </p>
          </TabsContent>
          <TabsContent value="tab2">
            <p className="mt-2 text-muted-foreground text-sm">
              Detailed usage metrics and charts.
            </p>
          </TabsContent>
          <TabsContent value="tab3">
            <p className="mt-2 text-muted-foreground text-sm">
              Manage project configuration.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          underline
        </p>
        <Tabs className="w-full" defaultValue="tab1">
          <TabsList className="w-full" variant="underline">
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Analytics</TabsTrigger>
            <TabsTrigger value="tab3">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p className="mt-2 text-muted-foreground text-sm">
              A summary of your project activity.
            </p>
          </TabsContent>
          <TabsContent value="tab2">
            <p className="mt-2 text-muted-foreground text-sm">
              Detailed usage metrics and charts.
            </p>
          </TabsContent>
          <TabsContent value="tab3">
            <p className="mt-2 text-muted-foreground text-sm">
              Manage project configuration.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
