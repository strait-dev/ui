import type { Meta, StoryObj } from "@storybook/react-vite";

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

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Project settings</CardTitle>
        <CardDescription>Manage your project configuration.</CardDescription>
        <CardAction>
          <Button size="icon-sm" variant="ghost">
            ⋯
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Update the name, visibility, and members of your project here.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Save changes</Button>
      </CardFooter>
    </Card>
  ),
};
