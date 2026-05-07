"use client"

import { useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Trophy, User, ChevronsUpDown, Check } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { switchUserAccount } from "@/app/(dashboard)/actions"

const mainNavItems = [
  { title: "Game Day",         url: "/game-day" },
  { title: "My Schedule",      url: "/my-schedule" },
  { title: "Players",          url: "/players" },
  { title: "Academy Settings", url: "/settings" },
]

interface AppSidebarProps {
  accounts?: { id: string; name: string }[]
  activeAccountId?: string
  logoUrl?: string | null
}

export function AppSidebar({ accounts = [], activeAccountId, logoUrl }: AppSidebarProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const activeAccount = accounts.find(a => a.id === activeAccountId)

  function handleSwitch(accountId: string) {
    if (accountId === activeAccountId) return
    startTransition(() => { switchUserAccount(accountId) })
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-3 py-2">
          <span
            className="text-xl tracking-wide"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            Academy Pool Pro
          </span>
        </div>
        {logoUrl && (
          <div className="border-t px-3 py-3">
            <div className="relative h-10 w-full">
              <Image
                src={logoUrl}
                alt="Academy logo"
                fill
                className="object-contain object-left"
                unoptimized
              />
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/profile"}
              tooltip="Profile"
            >
              <Link href="/profile">
                <User />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {accounts.length > 1 && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Switch academy"
                    disabled={isPending}
                    className="data-[state=open]:bg-sidebar-accent"
                  >
                    <Trophy className="shrink-0" />
                    <span className="truncate">{activeAccount?.name ?? "Select academy"}</span>
                    <ChevronsUpDown className="ml-auto shrink-0 opacity-50" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Switch academy
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {accounts.map((account) => (
                    <DropdownMenuItem
                      key={account.id}
                      onSelect={() => handleSwitch(account.id)}
                      className="gap-2"
                    >
                      <span className="truncate">{account.name}</span>
                      {account.id === activeAccountId && (
                        <Check className="ml-auto size-4 shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
