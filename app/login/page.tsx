import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { signInWithEmail } from './actions'

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await props.searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your soccer academy</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {decodeURIComponent(error)}
          </div>
        )}

        {/* Social logins */}
        <div className="flex flex-col gap-3">
          <Button variant="outline" className="w-full gap-3" asChild>
            <Link href="/login/google">
              {/* Google "G" */}
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Link>
          </Button>

          <Button variant="outline" className="w-full gap-3" asChild>
            <Link href="/login/facebook">
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Link>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-muted/30 px-3 text-xs uppercase tracking-wider text-muted-foreground">
              or sign in with email
            </span>
          </div>
        </div>

        {/* Email / password form */}
        <form action={signInWithEmail} className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </Field>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
