import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@strait/ui/components/avatar";
import { Badge } from "@strait/ui/components/badge";
import { Button } from "@strait/ui/components/button";
import { Card, CardContent } from "@strait/ui/components/card";

export default function ProfileHeaderBlock() {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3">
          <Avatar size="xl">
            <AvatarImage
              alt="Mia Torres"
              src="https://i.pravatar.cc/150?img=5"
            />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-lg leading-none">
              Mia Torres
            </span>
            <span className="text-muted-foreground text-sm">
              @mia · Product Designer
            </span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <Badge size="sm" variant="primary-light">
                Pro
              </Badge>
              <Badge size="sm" variant="secondary">
                Admin
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Edit profile
          </Button>
          <Button size="sm" variant="brand-solid">
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
