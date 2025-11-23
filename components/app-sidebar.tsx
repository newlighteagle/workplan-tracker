"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Workplan App",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  projects: [],
}

export function AppSidebar({ menus, user, ...props }: React.ComponentProps<typeof Sidebar> & { menus: any[], user: any }) {
  const navMain = menus.map((menu) => ({
    title: menu.title,
    url: menu.url,
    icon: menu.icon === "PieChart" ? PieChart : Map, // Simple icon mapping for now
    isActive: true,
    items: menu.children.map((child: any) => ({
      title: child.title,
      url: child.url,
    })),
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
