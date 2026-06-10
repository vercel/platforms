'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard error]', error)
  }, [error])

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="size-10 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {error.message || 'An unexpected error occurred.'}
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-muted-foreground">Error ID: {error.digest}</p>
        )}
      </div>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
