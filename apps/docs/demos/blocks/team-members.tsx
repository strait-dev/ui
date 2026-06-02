import { Avatar, AvatarFallback } from "@strait/ui/components/avatar";
import { Badge } from "@strait/ui/components/badge";
import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { Separator } from "@strait/ui/components/separator";

const members = [
  {
    id: "1",
    name: "Alice Martin",
    email: "alice@example.com",
    initials: "AM",
    role: "Owner",
    roleBadgeVariant: "default" as const,
  },
  {
    id: "2",
    name: "Bob Chen",
    email: "bob@example.com",
    initials: "BC",
    role: "Admin",
    roleBadgeVariant: "secondary" as const,
  },
  {
    id: "3",
    name: "Carol Singh",
    email: "carol@example.com",
    initials: "CS",
    role: "Member",
    roleBadgeVariant: "outline" as const,
  },
  {
    id: "4",
    name: "Daniel Rivera",
    email: "daniel@example.com",
    initials: "DR",
    role: "Member",
    roleBadgeVariant: "outline" as const,
  },
];

export default function TeamMembersBlock() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>
          Manage your team and their access levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {members.map((member, index) => (
          <div key={member.id}>
            {index > 0 ? <Separator /> : null}
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar size="default">
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium text-sm leading-snug">
                  {member.name}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  {member.email}
                </span>
              </div>
              <Badge size="sm" variant={member.roleBadgeVariant}>
                {member.role}
              </Badge>
              <Button size="sm" variant="ghost">
                Manage
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
