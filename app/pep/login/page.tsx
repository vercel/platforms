import { pepLogin } from '../actions'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function PepLoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Pep</h1>
          <p className="mt-1 text-sm text-muted-foreground">System admin access</p>
        </div>
        <form action={pepLogin} className="space-y-4">
          <div className="space-y-2">
            <input
              type="password"
              name="secret"
              placeholder="Secret"
              required
              autoFocus
              className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && (
              <p className="text-sm text-destructive">Incorrect secret. Try again.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
