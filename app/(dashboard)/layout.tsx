import { cookies } from 'next/headers'
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabase'
import { getUserAccount, getSystemAdmin } from '@/lib/auth'
import { roleLabel } from '@/lib/roles'
import { exitAccount } from '@/app/pep/actions'
import { signOut } from '@/app/login/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const activeAccountId = cookieStore.get('pep_account_id')?.value ?? null

  // Pep impersonation banner
  let activeAccountName: string | null = null
  let activeAccountLogoUrl: string | null = null
  if (activeAccountId) {
    const { data } = await supabase
      .from('accounts')
      .select('name, logo_url')
      .eq('id', activeAccountId)
      .single()
    activeAccountName = data?.name ?? null
    activeAccountLogoUrl = data?.logo_url ?? null
  }

  // Real authenticated user (null when Pep admin is impersonating)
  const userAccount = activeAccountId ? null : await getUserAccount()

  // Fetch all accounts this user belongs to (for account switcher)
  let userAccounts: { id: string; name: string }[] = []
  let activeAccountLogoUrlForUser: string | null = null
  if (userAccount) {
    const { data: memberships } = await supabase
      .from('account_members')
      .select('account_id')
      .eq('user_id', userAccount.userId)
    const accountIds = (memberships ?? []).map((m: any) => m.account_id)
    if (accountIds.length > 0) {
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('id, name, logo_url')
        .in('id', accountIds)
      userAccounts = (accountsData ?? []).map(({ id, name }) => ({ id, name }))
      const active = (accountsData ?? []).find((a: any) => a.id === userAccount.accountId)
      activeAccountLogoUrlForUser = active?.logo_url ?? null
    }
  }

  const logoUrl = activeAccountLogoUrl ?? activeAccountLogoUrlForUser

  // Role selector: show only when user is admin+ AND has a coach record
  const ROLE_RANK: Record<string, number> = { owner: 4, admin: 3, coach: 2, viewer: 1 }
  const canSwitchRole = !!(
    userAccount &&
    ROLE_RANK[userAccount.role] >= ROLE_RANK['admin'] &&
    userAccount.coachId
  )

  // Pep option in the selector: show when the logged-in user is a system admin
  // (only relevant outside impersonation, where userAccount is present).
  const isSystemAdmin = userAccount ? !!(await getSystemAdmin()) : false

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          accounts={userAccounts}
          activeAccountId={userAccount?.accountId}
          logoUrl={logoUrl}
          actualRole={userAccount?.role}
          activeRole={userAccount?.activeRole}
          canSwitchRole={canSwitchRole}
          isSystemAdmin={isSystemAdmin}
        />
        <SidebarInset>
          {/* Pep impersonation banner */}
          {activeAccountName && (
            <div className="flex items-center justify-between border-b border-amber-500/30 bg-amber-500/10 px-4 py-2">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Viewing as <span className="font-semibold">{activeAccountName}</span>
              </p>
              <form action={exitAccount}>
                <button
                  type="submit"
                  className="text-xs text-amber-700 underline underline-offset-2 hover:text-amber-900 dark:text-amber-400"
                >
                  Exit
                </button>
              </form>
            </div>
          )}

          <header className="flex h-14 shrink-0 items-center justify-between border-b px-4" style={{ backgroundColor: 'rgb(250, 250, 250)' }}>
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>

            {userAccount && (
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-muted-foreground sm:block">
                  {userAccount.displayName ?? userAccount.email}
                </span>
                <Badge variant="secondary" className="capitalize">
                  {roleLabel(userAccount.role)}
                </Badge>
                <form action={signOut}>
                  <Button type="submit" variant="ghost" size="sm">
                    Sign out
                  </Button>
                </form>
              </div>
            )}
          </header>

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
