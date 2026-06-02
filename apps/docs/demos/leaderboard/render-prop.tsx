"use client";

import {
  Leaderboard,
  LeaderboardContent,
  LeaderboardEnd,
  LeaderboardHeader,
  LeaderboardItem,
  LeaderboardStart,
  LeaderboardTitle,
} from "@strait/ui/components/leaderboard";

const features = [
  { name: "AI autocomplete", votes: 320 },
  { name: "Dark mode", votes: 274 },
  { name: "Custom themes", votes: 198 },
  { name: "Export to CSV", votes: 143 },
  { name: "Keyboard shortcuts", votes: 89 },
];

const max = Math.max(...features.map((f) => f.votes));

export default function LeaderboardRenderPropDemo() {
  return (
    <div className="max-w-md">
      <Leaderboard>
        <LeaderboardHeader>
          <LeaderboardTitle>Feature requests</LeaderboardTitle>
        </LeaderboardHeader>
        <LeaderboardContent>
          {features.map((feature) => (
            <LeaderboardItem
              key={feature.name}
              maxValue={max}
              value={feature.votes}
            >
              {({ percentage }) => (
                <>
                  <LeaderboardStart>{feature.name}</LeaderboardStart>
                  <LeaderboardEnd>
                    {feature.votes} ({percentage.toFixed(0)}%)
                  </LeaderboardEnd>
                </>
              )}
            </LeaderboardItem>
          ))}
        </LeaderboardContent>
      </Leaderboard>
    </div>
  );
}
