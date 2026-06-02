import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@strait/ui/components/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { Separator } from "@strait/ui/components/separator";

const notifications = [
  {
    id: "1",
    name: "Alice Martin",
    initials: "AM",
    avatar: "https://i.pravatar.cc/150?img=1",
    title: "Commented on your post",
    description: "Looks great! I love the new design direction.",
    time: "2h ago",
  },
  {
    id: "2",
    name: "Bob Chen",
    initials: "BC",
    avatar: "https://i.pravatar.cc/150?img=2",
    title: "Assigned you to a task",
    description: "Please review the component contract changes.",
    time: "5h ago",
  },
  {
    id: "3",
    name: "Carol Singh",
    initials: "CS",
    avatar: "https://i.pravatar.cc/150?img=5",
    title: "Mentioned you in a thread",
    description: "Hey, what do you think about the new token names?",
    time: "1d ago",
  },
  {
    id: "4",
    name: "Daniel Rivera",
    initials: "DR",
    avatar: "",
    title: "Shared a file with you",
    description: "Q2 Design Handoff — Figma frames.zip",
    time: "2d ago",
  },
];

export default function NotificationListBlock() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notifications.map((item, index) => (
          <div key={item.id}>
            {index > 0 ? <Separator /> : null}
            <div className="flex items-start gap-3 px-6 py-4">
              <Avatar size="default">
                {item.avatar ? (
                  <AvatarImage alt={item.name} src={item.avatar} />
                ) : null}
                <AvatarFallback>{item.initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium text-sm leading-snug">
                  {item.title}
                </span>
                <span className="truncate text-muted-foreground text-sm">
                  {item.description}
                </span>
              </div>
              <span className="shrink-0 pt-0.5 text-muted-foreground text-xs">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
