import {
  Search01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./command";
import { DateRangePicker } from "./date-range-picker";
import { FileUploadDropzone, FileUploadList } from "./file-upload";
import { Input } from "./input";
import { Label } from "./label";
import { MetricCard } from "./metric-card";
import { Progress } from "./progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "./timeline";
import { Tracker } from "./tracker";

const meta = {
  title: "Blocks/Compositions",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Production-ready composition examples built only from Strait UI primitives. These blocks are Storybook-only references, not extra package exports.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const pageShell = "min-h-screen bg-background p-6 text-foreground";
const container = "mx-auto flex w-full max-w-6xl flex-col gap-6";

export const DashboardOverview: Story = {
  render: () => (
    <div className={pageShell}>
      <div className={container}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-balance font-medium text-2xl">
              Revenue overview
            </h1>
            <p className="text-muted-foreground text-sm">
              Track activation, revenue, and operational health.
            </p>
          </div>
          <Button variant="brand-solid">Export report</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            delta={{ label: "vs last month", value: 12.4 }}
            title="Revenue"
            value="$128,400"
          />
          <MetricCard
            delta={{ label: "vs last week", value: 4.8 }}
            title="Activation"
            value="84%"
          />
          <MetricCard
            delta={{ direction: "neutral", label: "no change", value: 0 }}
            title="Open incidents"
            value="2"
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline health</CardTitle>
              <CardDescription>
                Deployment status across the last 30 checks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tracker
                data={Array.from({ length: 30 }, (_, index) => ({
                  status: index % 11 === 0 ? "warning" : "success",
                  tooltip: `Check ${index + 1}`,
                }))}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground text-xs">P95 latency</p>
                  <p className="font-medium tabular-nums">184 ms</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground text-xs">Error rate</p>
                  <p className="font-medium tabular-nums">0.08%</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground text-xs">Deploys</p>
                  <p className="font-medium tabular-nums">18</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest product events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Invite accepted", "Plan upgraded", "Report exported"].map(
                (event) => (
                  <div
                    className="flex items-center justify-between gap-3"
                    key={event}
                  >
                    <span className="min-w-0 truncate text-sm">{event}</span>
                    <Badge variant="secondary-light">Now</Badge>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const SettingsPage: Story = {
  render: () => (
    <div className={pageShell}>
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[14rem_1fr]">
        <Card className="h-fit" size="sm">
          <CardContent className="space-y-1">
            {["Profile", "Workspace", "Security", "Billing"].map(
              (item, index) => (
                <Button
                  className="w-full justify-start"
                  key={item}
                  variant={index === 0 ? "secondary" : "ghost"}
                >
                  {item}
                </Button>
              )
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workspace settings</CardTitle>
            <CardDescription>
              Manage profile details and account defaults.
            </CardDescription>
            <CardAction>
              <Button variant="brand-solid">Save changes</Button>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input
                autoComplete="organization"
                defaultValue="Acme Labs"
                id="workspace-name"
                name="workspace-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-slug">Workspace slug</Label>
              <Input
                autoComplete="off"
                defaultValue="acme"
                id="workspace-slug"
                name="workspace-slug"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="support-email">Support email</Label>
              <Input
                autoComplete="email"
                defaultValue="support@acme.com"
                id="support-email"
                name="support-email"
                spellCheck={false}
                type="email"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const BillingPlans: Story = {
  render: () => (
    <div className={pageShell}>
      <div className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-3">
        {[
          {
            name: "Starter",
            price: "$19",
            badge: "Current",
            variant: "secondary-light" as const,
          },
          {
            name: "Growth",
            price: "$49",
            badge: "Recommended",
            variant: "primary-light" as const,
          },
          {
            name: "Scale",
            price: "$129",
            badge: "Advanced",
            variant: "info-light" as const,
          },
        ].map((plan) => (
          <Card
            className={plan.name === "Growth" ? "ring-brand/30" : undefined}
            key={plan.name}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                For teams standardizing product delivery.
              </CardDescription>
              <CardAction>
                <Badge variant={plan.variant}>{plan.badge}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium text-3xl">{plan.price}</span>
                <span className="text-muted-foreground text-sm"> / month</span>
              </div>
              <ul className="space-y-2 text-sm">
                {[
                  "Unlimited projects",
                  "Shared component library",
                  "Audit-ready exports",
                ].map((feature) => (
                  <li className="flex items-center gap-2" key={feature}>
                    <span className="size-1.5 rounded-full bg-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.name === "Growth" ? "brand-solid" : "outline"}
              >
                Choose {plan.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  ),
};

export const AuthFlow: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your Strait workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              autoComplete="email"
              id="auth-email"
              name="email"
              placeholder="you@example.com"
              spellCheck={false}
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              autoComplete="current-password"
              id="auth-password"
              name="password"
              type="password"
            />
          </div>
          <Button className="w-full" variant="brand-solid">
            Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};

export const DataExplorer: Story = {
  render: () => (
    <div className={pageShell}>
      <div className={container}>
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Filter, scan, and act on recent workspace projects.
            </CardDescription>
            <CardAction>
              <Button variant="outline">New project</Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-64 flex-1">
                <HugeiconsIcon
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  icon={Search01Icon}
                />
                <Input
                  autoComplete="off"
                  className="pl-9"
                  name="project-search"
                  placeholder="Search projects…"
                />
              </div>
              <Button variant="secondary">Active</Button>
              <Button variant="outline">Owner</Button>
            </div>
            <Table variant="striped">
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Deploys</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Atlas", "Live", "Maya", "18"],
                  ["Beacon", "Review", "Noah", "7"],
                  ["Cinder", "Draft", "Ava", "2"],
                ].map(([name, status, owner, deploys]) => (
                  <TableRow key={name}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === "Live"
                            ? "success-light"
                            : "secondary-light"
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>{owner}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {deploys}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const CommandCenter: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-xl p-0">
        <Command>
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandGroup heading="Actions">
              <CommandItem>
                <HugeiconsIcon icon={Search01Icon} /> Search projects{" "}
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Settings01Icon} /> Open settings{" "}
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={UserIcon} /> Invite teammate{" "}
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Card>
    </div>
  ),
};

export const NotificationCenter: Story = {
  render: () => (
    <div className={pageShell}>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Notification center</CardTitle>
          <CardDescription>
            Operational updates grouped by severity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline value={2} variant="success">
            <TimelineItem step={1}>
              <TimelineHeader>
                <TimelineSeparator />
                <TimelineIndicator />
                <TimelineDate>09:15</TimelineDate>
              </TimelineHeader>
              <TimelineTitle>Deployment completed</TimelineTitle>
              <TimelineContent>
                Production build finished with all checks passing.
              </TimelineContent>
            </TimelineItem>
            <TimelineItem step={2}>
              <TimelineHeader>
                <TimelineSeparator />
                <TimelineIndicator />
                <TimelineDate>10:40</TimelineDate>
              </TimelineHeader>
              <TimelineTitle>Incident acknowledged</TimelineTitle>
              <TimelineContent>
                Support assigned an owner and notified affected customers.
              </TimelineContent>
            </TimelineItem>
            <TimelineItem step={3}>
              <TimelineHeader>
                <TimelineSeparator />
                <TimelineIndicator />
                <TimelineDate>11:00</TimelineDate>
              </TimelineHeader>
              <TimelineTitle>Follow-up scheduled</TimelineTitle>
              <TimelineContent>
                Post-incident review added to the team calendar.
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>
    </div>
  ),
};

export const UploadMediaManager: Story = {
  render: () => (
    <div className={pageShell}>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Media manager</CardTitle>
          <CardDescription>
            Upload, review, and publish product assets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploadDropzone className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="font-medium">Drop files here or browse</p>
            <p className="text-muted-foreground text-sm">
              PNG, JPG, or PDF up to 10 MB.
            </p>
            <Button variant="outline">Browse files</Button>
          </FileUploadDropzone>
          <FileUploadList>
            <li className="rounded-lg border bg-background p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">brand-guidelines.pdf</span>
                <Badge variant="success-light">Ready</Badge>
              </div>
            </li>
            <li className="rounded-lg border bg-background p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">hero-image.png</span>
                <Badge variant="warning-light">Optimizing</Badge>
              </div>
            </li>
          </FileUploadList>
        </CardContent>
        <CardFooter className="gap-2">
          <Progress aria-label="Upload progress" value={68} />
          <span className="text-muted-foreground text-sm tabular-nums">
            68%
          </span>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const DateFilterToolbar: Story = {
  render: () => (
    <div className={pageShell}>
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Report filters</CardTitle>
          <CardDescription>
            Combine date, search, and status controls in one toolbar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="min-w-64 flex-1">
            <DateRangePicker label="Date range" />
          </div>
          <div className="min-w-52 flex-1 space-y-2">
            <Label htmlFor="toolbar-search">Search</Label>
            <Input
              autoComplete="off"
              id="toolbar-search"
              name="toolbar-search"
              placeholder="Customer or invoice…"
            />
          </div>
          <Button variant="secondary">Paid</Button>
          <Button variant="outline">Reset</Button>
        </CardContent>
      </Card>
    </div>
  ),
};
