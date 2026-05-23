import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Badge } from "./badge";
import {
  Leaderboard,
  LeaderboardAction,
  LeaderboardContent,
  LeaderboardEnd,
  LeaderboardHeader,
  LeaderboardItem,
  LeaderboardStart,
  LeaderboardTitle,
} from "./leaderboard";

type Row = { name: string; value: number; flag?: string };

const pages: Row[] = [
  { name: "/home", value: 4200 },
  { name: "/pricing", value: 3120 },
  { name: "/docs", value: 2480 },
  { name: "/blog", value: 1640 },
  { name: "/changelog", value: 980 },
];

const countries: Row[] = [
  { name: "United States", value: 5230, flag: "🇺🇸" },
  { name: "Germany", value: 3110, flag: "🇩🇪" },
  { name: "Japan", value: 2480, flag: "🇯🇵" },
  { name: "Brazil", value: 1870, flag: "🇧🇷" },
  { name: "France", value: 1240, flag: "🇫🇷" },
];

const numberFormatter = (v: number) => v.toLocaleString();

const meta: Meta<typeof Leaderboard> = {
  title: "Data Display/Leaderboard",
  component: Leaderboard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A ranked list with a value-proportional fill bar behind each row.",
          "A compound, tokenised API: compose `Leaderboard` → `LeaderboardHeader`",
          "→ `LeaderboardContent` → `LeaderboardItem` (with `LeaderboardStart` +",
          "`LeaderboardEnd`). Pass `onAction` to make rows keyboard-activatable.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const TopPages: Story = {
  render: () => {
    const max = Math.max(...pages.map((p) => p.value));
    return (
      <div className="max-w-md">
        <Leaderboard>
          <LeaderboardHeader>
            <LeaderboardTitle>Top pages</LeaderboardTitle>
          </LeaderboardHeader>
          <LeaderboardContent>
            {pages.map((page) => (
              <LeaderboardItem
                key={page.name}
                maxValue={max}
                value={page.value}
              >
                <LeaderboardStart>{page.name}</LeaderboardStart>
                <LeaderboardEnd>{numberFormatter(page.value)}</LeaderboardEnd>
              </LeaderboardItem>
            ))}
          </LeaderboardContent>
        </Leaderboard>
      </div>
    );
  },
};

export const WithHeaderAction: Story = {
  render: () => {
    const max = Math.max(...countries.map((c) => c.value));
    return (
      <div className="max-w-md">
        <Leaderboard>
          <LeaderboardHeader>
            <LeaderboardTitle>Visitors by country</LeaderboardTitle>
            <LeaderboardAction>
              <Badge variant="secondary">Last 7 days</Badge>
            </LeaderboardAction>
          </LeaderboardHeader>
          <LeaderboardContent>
            {countries.map((country) => (
              <LeaderboardItem
                key={country.name}
                maxValue={max}
                value={country.value}
              >
                <LeaderboardStart>
                  <span aria-hidden>{country.flag}</span>
                  {country.name}
                </LeaderboardStart>
                <LeaderboardEnd>
                  {numberFormatter(country.value)}
                </LeaderboardEnd>
              </LeaderboardItem>
            ))}
          </LeaderboardContent>
        </Leaderboard>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const max = Math.max(...pages.map((p) => p.value));
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div className="max-w-md space-y-3">
        <Leaderboard>
          <LeaderboardHeader>
            <LeaderboardTitle>Click a row</LeaderboardTitle>
          </LeaderboardHeader>
          <LeaderboardContent>
            {pages.map((page) => (
              <LeaderboardItem
                key={page.name}
                maxValue={max}
                onAction={() => setSelected(page.name)}
                value={page.value}
              >
                <LeaderboardStart>{page.name}</LeaderboardStart>
                <LeaderboardEnd>{numberFormatter(page.value)}</LeaderboardEnd>
              </LeaderboardItem>
            ))}
          </LeaderboardContent>
        </Leaderboard>
        <p className="text-muted-foreground text-sm">
          Selected: <span className="font-medium">{selected ?? "none"}</span>
        </p>
      </div>
    );
  },
};

export const RenderProp: Story = {
  render: () => {
    const max = Math.max(...pages.map((p) => p.value));
    return (
      <div className="max-w-md">
        <Leaderboard>
          <LeaderboardContent>
            {pages.map((page) => (
              <LeaderboardItem
                key={page.name}
                maxValue={max}
                value={page.value}
              >
                {({ percentage }) => (
                  <>
                    <LeaderboardStart>{page.name}</LeaderboardStart>
                    <LeaderboardEnd>{percentage.toFixed(0)}%</LeaderboardEnd>
                  </>
                )}
              </LeaderboardItem>
            ))}
          </LeaderboardContent>
        </Leaderboard>
      </div>
    );
  },
};
