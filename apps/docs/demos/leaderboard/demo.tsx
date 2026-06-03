import {
  Leaderboard,
  LeaderboardContent,
  LeaderboardEnd,
  LeaderboardHeader,
  LeaderboardItem,
  LeaderboardStart,
  LeaderboardTitle,
} from "@strait/ui/components/leaderboard";

const pages = [
  { name: "/home", visits: 4200 },
  { name: "/pricing", visits: 3100 },
  { name: "/docs", visits: 2700 },
  { name: "/blog", visits: 1950 },
  { name: "/about", visits: 1100 },
];

const maxValue = Math.max(...pages.map((p) => p.visits));

export default function LeaderboardDemo() {
  return (
    <div className="w-80">
      <Leaderboard>
        <LeaderboardHeader>
          <LeaderboardTitle>Top pages</LeaderboardTitle>
        </LeaderboardHeader>
        <LeaderboardContent>
          {pages.map((page) => (
            <LeaderboardItem
              key={page.name}
              maxValue={maxValue}
              value={page.visits}
            >
              <LeaderboardStart>{page.name}</LeaderboardStart>
              <LeaderboardEnd>{page.visits.toLocaleString()}</LeaderboardEnd>
            </LeaderboardItem>
          ))}
        </LeaderboardContent>
      </Leaderboard>
    </div>
  );
}
