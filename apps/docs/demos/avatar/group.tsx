import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@strait/ui/components/avatar";

export default function AvatarGroupDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Default size
        </p>
        <AvatarGroup>
          <Avatar size="default">
            <AvatarImage alt="Alice" src="https://i.pravatar.cc/150?img=1" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar size="default">
            <AvatarImage alt="Bob" src="https://i.pravatar.cc/150?img=2" />
            <AvatarFallback>BC</AvatarFallback>
          </Avatar>
          <Avatar size="default">
            <AvatarImage alt="Carol" src="https://i.pravatar.cc/150?img=3" />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
          <Avatar size="default">
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+8</AvatarGroupCount>
        </AvatarGroup>
      </div>

      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Large size
        </p>
        <AvatarGroup>
          <Avatar size="lg">
            <AvatarImage alt="Eve" src="https://i.pravatar.cc/150?img=5" />
            <AvatarFallback>EV</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage alt="Frank" src="https://i.pravatar.cc/150?img=6" />
            <AvatarFallback>FG</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>HK</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </div>
    </div>
  );
}
