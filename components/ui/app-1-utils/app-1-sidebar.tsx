"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  Image as ImageIcon,
  Sparkles,
  Settings,
  Coffee,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  Store,
  CalendarCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/app-1-utils/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { app1User } from "./app-1-data";

const navItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Menu & Dishes",
    href: "/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Cafe & Gallery Photos",
    href: "/admin/photos",
    icon: ImageIcon,
  },
  {
    title: "Home Highlights",
    href: "/admin/highlights",
    icon: Sparkles,
  },
  {
    title: "Amenities & Atmosphere",
    href: "/admin/amenities",
    icon: Coffee,
  },
  {
    title: "Site & Store Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function App1Sidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                  2D
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-wide">
                    Bite &amp; Beans
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Admin Studio • Guwahati
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="size-4 shrink-0" />
                      <span>{item.title}</span>
                      {isActive && (
                        <ChevronRight className="ml-auto size-3 opacity-60" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Public Presence</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Visit Public Site">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Store className="size-4 shrink-0" />
                  <span>View 2D Cafe Site</span>
                  <ExternalLink className="ml-auto size-3 opacity-50" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Table Reservations">
                <Link
                  href="/visit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <CalendarCheck className="size-4 shrink-0" />
                  <span>Visit &amp; Hours</span>
                  <ExternalLink className="ml-auto size-3 opacity-50" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={app1User.avatar} alt={app1User.name} />
                <AvatarFallback className="rounded-lg">
                  {app1User.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{app1User.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {app1User.role}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

