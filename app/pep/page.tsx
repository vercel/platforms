import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { createAccount, switchAccount, pepLogout } from './actions'
import { LogIn, LogOut, Plus, Building2 } from 'lucide-react'

export default async function PepPage() {
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pep</h1>
          <p className="text-sm text-muted-foreground mt-1">System admin · {accounts?.length ?? 0} accounts</p>
        </div>
        <form action={pepLogout}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </div>

      {/* Create account */}
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm font-medium mb-3">New account</p>
        <form action={createAccount} className="flex gap-2">
          <input
            type="text"
            name="name"
            placeholder="Academy name"
            required
            className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Create
          </button>
        </form>
      </div>

      {/* Accounts list */}
      <div className="rounded-lg border bg-card divide-y">
        {!accounts?.length ? (
          <div className="py-12 text-center text-sm text-muted-foreground">No accounts yet</div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                <Building2 className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{account.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(account.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <form action={switchAccount}>
                <input type="hidden" name="accountId" value={account.id} />
                <button
                  type="submit"
                  title={`Log in as ${account.name}`}
                  className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogIn className="size-3.5" />
                  Log in as
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
