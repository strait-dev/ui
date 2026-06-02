import { Badge } from "@strait/ui/components/badge";
import { Card, CardContent } from "@strait/ui/components/card";

const stats = [
  {
    label: "Total Revenue",
    value: "$48,295",
    delta: "+12%",
    positive: true,
  },
  {
    label: "Active Users",
    value: "2,847",
    delta: "+4%",
    positive: true,
  },
  {
    label: "New Signups",
    value: "318",
    delta: "+23%",
    positive: true,
  },
  {
    label: "Churn Rate",
    value: "2.4%",
    delta: "-0.3%",
    positive: false,
  },
];

export default function StatsGridBlock() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex flex-col gap-2 pt-5">
            <span className="text-muted-foreground text-sm">{stat.label}</span>
            <span className="font-bold text-2xl">{stat.value}</span>
            <Badge
              className="w-fit"
              variant={stat.positive ? "success-light" : "destructive-light"}
            >
              {stat.delta}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
