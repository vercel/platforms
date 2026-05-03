import { cookies } from 'next/headers'
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { supabase } from '@/lib/supabase'
import { exitAccount } from '@/app/pep/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const activeAccountId = cookieStore.get('pep_account_id')?.value ?? null

  let activeAccountName: string | null = null
  if (activeAccountId) {
    const { data } = await supabase
      .from('accounts')
      .select('name')
      .eq('id', activeAccountId)
      .single()
    activeAccountName = data?.name ?? null
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
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
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
