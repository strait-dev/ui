import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge } from "./badge";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { NativeSelect, NativeSelectOption } from "./native-select";
import { Progress } from "./progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Tracker } from "./tracker";

const meta = {
  title: "Foundations/Visual State Matrices",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Cross-component state matrices for visual QA. Use these stories before releases to compare variants, sizes, disabled states, invalid states, and semantic status colours in one place.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const intents = ["brand", "success", "warning", "info", "destructive"] as const;

export const ActionsAndBadges: Story = {
  render: () => (
    <div className="space-y-8">
      <section className="space-y-3">
        <div>
          <h2 className="font-medium text-lg">Button intent matrix</h2>
          <p className="text-muted-foreground text-sm">
            Solid, soft, and outline treatments should read as one family across
            intents.
          </p>
        </div>
        <div className="grid gap-3">
          {intents.map((intent) => (
            <div className="flex flex-wrap items-center gap-2" key={intent}>
              <span className="w-24 text-muted-foreground text-sm capitalize">
                {intent}
              </span>
              <Button variant={`${intent}-solid` as never}>Solid</Button>
              <Button variant={intent as never}>Soft</Button>
              <Button variant={`${intent}-outline` as never}>Outline</Button>
              <Button disabled variant={`${intent}-solid` as never}>
                Disabled
              </Button>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <div>
          <h2 className="font-medium text-lg">Badge state matrix</h2>
          <p className="text-muted-foreground text-sm">
            Compare solid, light, and outline badges against surrounding text.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "default",
            "secondary",
            "success",
            "success-light",
            "success-outline",
            "warning",
            "warning-light",
            "warning-outline",
            "info",
            "info-light",
            "destructive",
            "destructive-light",
          ].map((variant) => (
            <Badge key={variant} variant={variant as never}>
              {variant}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  ),
};

export const FormsAndTabs: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <div>
          <h2 className="font-medium text-lg">Form control states</h2>
          <p className="text-muted-foreground text-sm">
            Height, invalid rings, and disabled states should align across
            controls.
          </p>
        </div>
        <div className="grid gap-3">
          {(["sm", "default", "lg"] as const).map((size) => (
            <div className="grid gap-2" key={size}>
              <Label htmlFor={`matrix-input-${size}`}>Input {size}</Label>
              <Input
                id={`matrix-input-${size}`}
                name={`matrix-input-${size}`}
                placeholder="you@example.com"
                size={size}
              />
            </div>
          ))}
          <Input
            aria-invalid
            name="invalid-email"
            placeholder="Invalid email"
          />
          <Input disabled name="disabled-email" placeholder="Disabled input" />
          <NativeSelect aria-label="Plan" defaultValue="">
            <NativeSelectOption disabled value="">
              Choose a plan
            </NativeSelectOption>
            <NativeSelectOption value="starter">Starter</NativeSelectOption>
            <NativeSelectOption value="growth">Growth</NativeSelectOption>
          </NativeSelect>
        </div>
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="font-medium text-lg">Tabs states</h2>
          <p className="text-muted-foreground text-sm">
            Active, hover, focus, and disabled triggers should retain the same
            geometry.
          </p>
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger disabled value="disabled">
              Disabled
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview content</TabsContent>
          <TabsContent value="activity">Activity content</TabsContent>
        </Tabs>
      </section>
    </div>
  ),
};

export const FeedbackAndStatus: Story = {
  render: () => (
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-2">
        {(
          [
            "default",
            "info",
            "success",
            "warning",
            "destructive",
            "invert",
          ] as const
        ).map((variant) => (
          <Alert key={variant} variant={variant}>
            <AlertTitle className="capitalize">{variant}</AlertTitle>
            <AlertDescription>
              Use this state for high-signal contextual feedback.
            </AlertDescription>
          </Alert>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="font-medium text-lg">Progress and tracker states</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Progress
            aria-label="Success progress"
            value={72}
            variant="success"
          />
          <Progress
            aria-label="Warning progress"
            value={48}
            variant="warning"
          />
        </div>
        <Tracker
          aria-label="Service status matrix"
          data={[
            { status: "success", tooltip: "Operational" },
            { status: "success", tooltip: "Operational" },
            { status: "warning", tooltip: "Degraded" },
            { status: "info", tooltip: "Maintenance" },
            { status: "destructive", tooltip: "Outage" },
          ]}
        />
      </section>
    </div>
  ),
};
