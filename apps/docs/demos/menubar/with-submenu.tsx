import { Copy01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@strait/ui/components/menubar";

export default function MenubarWithSubmenuDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <HugeiconsIcon icon={Copy01Icon} />
            Copy
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Cut
            <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Paste Special</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Paste Values</MenubarItem>
              <MenubarItem>Paste Formatting</MenubarItem>
              <MenubarItem>Paste as Plain Text</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <HugeiconsIcon icon={Delete02Icon} />
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Bold</MenubarItem>
          <MenubarItem>Italic</MenubarItem>
          <MenubarItem>Underline</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
