"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
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
  Workflow,
  FileClock, // Added for AuditLogs
  BarChart3,
  LifeBuoy,
  Send, // Added for Analytics
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { title } from "process"
import { NavSecondary } from "@/components/nav-secondary"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  subdomain: string;
}

export function AppSidebar({ subdomain, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  // This is sample data.
  const data = {
    user: {
      name: "Johnathan Smith",
      email: "jsmith@acme.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
      
      {
        title: "Insights",
        url: `/s/${subdomain}/insights`,
        icon: SquareTerminal,
        isActive: pathname === `/s/${subdomain}/insights`,
      },
     {
        title: 'Workflows',
        url: `/s/${subdomain}/workflows`,
        icon: Workflow,
        isActive: pathname === `/s/${subdomain}/workflows`,
      },
      {
        title: "Models",
        url: `/s/${subdomain}/models`,
        icon: Bot,
        isActive: pathname === `/s/${subdomain}/models`,
      },
      
      {
        title: 'Audit Logs',
        url: `/s/${subdomain}/audit`,
        icon: FileClock,
        isActive: pathname === `/s/${subdomain}/audit`,
      },
      {
        title: 'Analytics',
        url: `/s/${subdomain}/analytics`,
        icon: BarChart3,
        isActive: pathname === `/s/${subdomain}/analytics`,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
        isActive: false,
      },
      {
        title: "Settings",
        url: `/s/${subdomain}/settings`,
        icon: Settings2,
        isActive: pathname === `/s/${subdomain}/settings`,
      },
      {
        title: "Documentation",
        url: `/s/${subdomain}/docs`,
        icon: BookOpen,
        isActive: pathname === `/s/${subdomain}/docs`,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
        isActive: false,
      },
    ],

  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
