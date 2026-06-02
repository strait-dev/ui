import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@strait/ui/components/avatar";

export default function AvatarSizes() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Avatar size="xs">
        <AvatarImage alt="Alice Martin" src="https://i.pravatar.cc/150?img=1" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarImage alt="Alice Martin" src="https://i.pravatar.cc/150?img=1" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage alt="Alice Martin" src="https://i.pravatar.cc/150?img=1" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage alt="Alice Martin" src="https://i.pravatar.cc/150?img=1" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarImage alt="Alice Martin" src="https://i.pravatar.cc/150?img=1" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
    </div>
  );
}
