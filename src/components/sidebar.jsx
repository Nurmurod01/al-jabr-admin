"use client";

import * as React from "react";
import {
  BarChart3,
  ShoppingCart,
  Package,
  LogOut,
  FileJson,
  BarChartIcon as ChartBarStacked,
  PlusSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 👈 import qildik

const NAV_ITEMS = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Class",
    icon: ChartBarStacked,
    href: "/class",
  },
  {
    title: "Chapter",
    icon: Package,
    href: "/chapters",
  },
  {
    title: "Topic",
    icon: ShoppingCart,
    href: "/topic",
  },
  {
    title: "Questions",
    icon: PlusSquare,
    href: "/questions",
  },
  {
    title: "Questions JSON",
    icon: FileJson,
    href: "/questionsJson",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const renderNavItems = React.useMemo(() => {
    return NAV_ITEMS.map((item) => {
      const isActive = pathname.startsWith(item.href);

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isActive}>
            <Link
              href={item.href}
              className="flex items-center justify-between"
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                <span className="text-lg">{item.title}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  }, [pathname]);

  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Package className="h-5 w-5" />
          </div>
          <div className="font-semibold">Admin Panel</div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="Admin user avatar"
                loading="lazy"
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
            </div>
          </div>
        </div>

        <SidebarSeparator />

        <nav aria-label="Main Navigation">
          <div className="px-2 py-2">
            <div className="mb-2 px-2 text-md font-medium text-muted-foreground">
              MAIN MENU
            </div>
            <SidebarMenu className="space-y-3">{renderNavItems}</SidebarMenu>
          </div>
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                className="flex w-full items-center gap-2 text-red-500"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
