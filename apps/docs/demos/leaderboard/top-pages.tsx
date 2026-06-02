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
  { name: "/home", value: 4200 },
  { name: "/pricing", value: 3120 },
  { name: "/docs", value: 2480 },
  { name: "/blog", value: 1640 },
  { name: "/changelog", value: 980 },
];

const max = Math.max(...pages.map((p) => p.value));

export default function LeaderboardTopPagesDemo() {
  return (
    <div className="max-w-md">
      <Leaderboard>
        <LeaderboardHeader>
          <LeaderboardTitle>Top pages</LeaderboardTitle>
        </LeaderboardHeader>
        <LeaderboardContent>
          {pages.map((page) => (
            <LeaderboardItem key={page.name} maxValue={max} value={page.value}>
              <LeaderboardStart>{page.name}</LeaderboardStart>
              <LeaderboardEnd>{page.value.toLocaleString()}</LeaderboardEnd>
            </LeaderboardItem>
          ))}
        </LeaderboardContent>
      </Leaderboard>
    </div>
  );
}
