"use client";

import {
  Home01Icon,
  Notification01Icon,
  Search01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@strait/ui/components/sidebar";

const navItems = [
  { icon: Home01Icon, label: "Dashboard", id: "dashboard" },
  { icon: Search01Icon, label: "Search", id: "search" },
  { icon: Notification01Icon, label: "Notifications", id: "notifications" },
  { icon: Settings01Icon, label: "Settings", id: "settings" },
] as const;

export default function SidebarCollapsibleVariantsDemo() {
  return (
    <div className="[&_[data-slot=sidebar-container]]:!h-full flex h-[420px] w-full transform-gpu overflow-hidden rounded-lg border">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="offcanvas">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <span className="font-bold text-sm">A</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 leading-tight">
                    <span className="font-semibold">Acme Inc.</span>
                    <span className="text-muted-foreground text-xs">
                      Workspace
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map(({ icon, label, id }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        active={id === "dashboard"}
                        tooltip={label}
                      >
                        <HugeiconsIcon icon={icon} />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="font-medium text-sm">Dashboard</span>
          </header>
          <main className="p-4">
            <p className="text-muted-foreground text-sm">
              collapsible=<code>"offcanvas"</code> — the sidebar slides fully
              off-screen when closed.
            </p>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
