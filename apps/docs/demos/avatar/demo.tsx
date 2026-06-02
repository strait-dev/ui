import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@strait/ui/components/avatar";

export default function AvatarDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          <AvatarImage
            alt="Alice Martin"
            src="https://i.pravatar.cc/150?img=1"
          />
          <AvatarFallback>AM</AvatarFallback>
          <AvatarBadge status="online" />
        </Avatar>
        <Avatar size="lg">
          <AvatarImage alt="Bob Chen" src="https://i.pravatar.cc/150?img=2" />
          <AvatarFallback>BC</AvatarFallback>
          <AvatarBadge status="busy" />
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>JS</AvatarFallback>
          <AvatarBadge status="away" />
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>EK</AvatarFallback>
          <AvatarBadge status="offline" />
        </Avatar>
      </div>

      <AvatarGroup>
        <Avatar size="default">
          <AvatarImage alt="Carol" src="https://i.pravatar.cc/150?img=3" />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarImage alt="Dan" src="https://i.pravatar.cc/150?img=4" />
          <AvatarFallback>D</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarFallback>EV</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}
