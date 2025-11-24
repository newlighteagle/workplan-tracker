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
import { TrackerNav } from "@/components/tracker-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import * as LucideIcons from "lucide-react"

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
      logo: LucideIcons.GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  projects: [],
}

interface District {
  id: number
  code: string
  name: string
  ics: Array<{
    id: number
    abbreviation: string | null
    districtId: number
  }>
}

export function AppSidebar({ menus, districts, user, ...props }: React.ComponentProps<typeof Sidebar> & { menus: any[], districts?: District[], user: any }) {
  // Separate Tracker menu from other menus
  const trackerMenu = menus.find((menu) => menu.title === "Tracker")
  const otherMenus = menus.filter((menu) => menu.title !== "Tracker")

  const navMain = otherMenus.map((menu) => {
    // Get icon from lucide-react dynamically
    const IconComponent = (LucideIcons as any)[menu.icon] || LucideIcons.Map

    return {
      title: menu.title,
      url: menu.url,
      icon: IconComponent,
      isActive: true,
      items: menu.children.map((child: any) => ({
        title: child.title,
        url: child.url,
      })),
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />

        {/* Tracker Menu with Dynamic Districts/ICS */}
        {trackerMenu && districts && (
          <SidebarGroup>
            <SidebarGroupLabel>Tracker</SidebarGroupLabel>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Tracker">
                      <LucideIcons.ClipboardList />
                      <span>Tracker</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <TrackerNav districts={districts} />
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
