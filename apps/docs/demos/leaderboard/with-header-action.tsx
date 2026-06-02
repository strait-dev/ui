import { Badge } from "@strait/ui/components/badge";
import {
  Leaderboard,
  LeaderboardAction,
  LeaderboardContent,
  LeaderboardEnd,
  LeaderboardHeader,
  LeaderboardItem,
  LeaderboardStart,
  LeaderboardTitle,
} from "@strait/ui/components/leaderboard";

const countries = [
  { name: "United States", value: 5230, flag: "🇺🇸" },
  { name: "Germany", value: 3110, flag: "🇩🇪" },
  { name: "Japan", value: 2480, flag: "🇯🇵" },
  { name: "Brazil", value: 1870, flag: "🇧🇷" },
  { name: "France", value: 1240, flag: "🇫🇷" },
];

const max = Math.max(...countries.map((c) => c.value));

export default function LeaderboardWithHeaderActionDemo() {
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
              <LeaderboardEnd>{country.value.toLocaleString()}</LeaderboardEnd>
            </LeaderboardItem>
          ))}
        </LeaderboardContent>
      </Leaderboard>
    </div>
  );
}
