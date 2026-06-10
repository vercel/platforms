"use client"

import { useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { User, ChevronsUpDown, Check, Trophy, ShieldCheck, UserRound } from "lucide-react"

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
import { switchUserAccount, setActiveRole } from "@/app/(dashboard)/actions"
import type { Role } from "@/lib/roles"

const ADMIN_NAV = [
  { title: "Game Day",         url: "/game-day" },
  { title: "Players",          url: "/players" },
  { title: "Academy Settings", url: "/settings" },
]

const COACH_NAV = [
  { title: "Game Day",    url: "/game-day" },
  { title: "My Schedule", url: "/my-schedule" },
  { title: "Players",     url: "/players" },
]

interface AppSidebarProps {
  accounts?: { id: string; name: string }[]
  activeAccountId?: string
  logoUrl?: string | null
  actualRole?: Role
  activeRole?: Role
  canSwitchRole?: boolean
}

export function AppSidebar({
  accounts = [],
  activeAccountId,
  logoUrl,
  actualRole,
  activeRole,
  canSwitchRole = false,
}: AppSidebarProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const activeAccount = accounts.find(a => a.id === activeAccountId)
  const isCoachView = activeRole === 'coach'
  const navItems = isCoachView ? COACH_NAV : ADMIN_NAV

  function handleSwitch(accountId: string) {
    if (accountId === activeAccountId) return
    startTransition(() => { switchUserAccount(accountId) })
  }

  function handleSetRole(role: Role) {
    if (role === activeRole) return
    startTransition(() => { setActiveRole(role, pathname) })
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
              {navItems.map((item) => (
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

          {/* Role selector — only shown when user can switch between admin and coach view */}
          {canSwitchRole && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Switch view"
                    disabled={isPending}
                    className="data-[state=open]:bg-sidebar-accent"
                  >
                    {isCoachView
                      ? <UserRound className="shrink-0" />
                      : <ShieldCheck className="shrink-0" />
                    }
                    <span>{isCoachView ? 'Coach View' : 'Admin View'}</span>
                    <ChevronsUpDown className="ml-auto shrink-0 opacity-50" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-52">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    View as
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => handleSetRole(actualRole ?? 'admin')}
                    className="gap-2"
                  >
                    <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
                    <span>Admin View</span>
                    {!isCoachView && <Check className="ml-auto size-4 shrink-0" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleSetRole('coach')}
                    className="gap-2"
                  >
                    <UserRound className="size-4 shrink-0 text-muted-foreground" />
                    <span>Coach View</span>
                    {isCoachView && <Check className="ml-auto size-4 shrink-0" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}

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
