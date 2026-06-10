import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { requireSystemAdmin } from '@/lib/auth'
import {
  createAccount,
  switchAccount,
  addSystemAdmin,
  updateSystemAdminName,
  removeSystemAdmin,
} from './actions'
import { LogIn, Plus, Building2, ArrowLeft, ShieldCheck, Trash2, Check } from 'lucide-react'

export default async function PepPage() {
  const currentAdmin = await requireSystemAdmin()

  const [{ data: accounts }, { data: admins }] = await Promise.all([
    supabase.from('accounts').select('id, name, created_at').order('created_at', { ascending: false }),
    supabase.from('system_admins').select('id, email, name').order('created_at'),
  ])

  const adminCount = admins?.length ?? 0

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pep</h1>
          <p className="text-sm text-muted-foreground mt-1">System admin · {accounts?.length ?? 0} accounts</p>
        </div>
        <Link
          href="/game-day"
          className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          Back to app
        </Link>
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
      <div>
        <p className="text-sm font-medium mb-2">Accounts</p>
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

      {/* System admins */}
      <div>
        <p className="text-sm font-medium mb-2">System admins</p>

        {/* Add admin */}
        <div className="rounded-lg border bg-card p-4 mb-3">
          <form action={addSystemAdmin} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              required
              className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              name="name"
              placeholder="Name (optional)"
              className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Add admin
            </button>
          </form>
        </div>

        {/* Admins list */}
        <div className="rounded-lg border bg-card divide-y">
          {!admins?.length ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No system admins</div>
          ) : (
            admins.map((admin) => {
              const isSelf = admin.email === currentAdmin.email
              return (
                <div key={admin.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                  </div>
                  <form action={updateSystemAdminName} className="flex flex-1 items-center gap-2 min-w-0">
                    <input type="hidden" name="id" value={admin.id} />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        name="name"
                        defaultValue={admin.name ?? ''}
                        placeholder="Name"
                        className="w-full rounded-md border bg-background px-2.5 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <p className="mt-1 text-xs text-muted-foreground truncate">
                        {admin.email}
                        {isSelf && <span className="ml-1.5 rounded bg-muted px-1.5 py-0.5">You</span>}
                      </p>
                    </div>
                    <button
                      type="submit"
                      title="Save name"
                      className="flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Check className="size-3.5" />
                      Save
                    </button>
                  </form>
                  <form action={removeSystemAdmin}>
                    <input type="hidden" name="id" value={admin.id} />
                    <button
                      type="submit"
                      title={adminCount <= 1 ? 'Cannot remove the last admin' : 'Remove admin'}
                      disabled={adminCount <= 1}
                      className="flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </button>
                  </form>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
