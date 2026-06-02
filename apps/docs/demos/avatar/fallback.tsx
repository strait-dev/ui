import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@strait/ui/components/avatar";

export default function AvatarFallbackDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar size="lg">
        <AvatarImage
          alt="Will not load"
          src="https://example.invalid/avatar.png"
        />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>BC</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>CS</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>DR</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>EV</AvatarFallback>
      </Avatar>
    </div>
  );
}
