import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  changeLabel?: string
  trend?: 'up' | 'down' | 'flat'
  className?: string
}

export function KpiCard({
  title,
  value,
  changeLabel,
  trend = 'flat',
  className,
  ...props
}: KpiCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />
      case 'down':
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* Main Value */}
          <div className="text-2xl font-bold tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>

          {/* Change Label with Trend */}
          {changeLabel && (
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={cn(
                  'flex items-center space-x-1 px-2 py-1 text-xs',
                  getTrendColor()
                )}
              >
                {getTrendIcon()}
                <span>{changeLabel}</span>
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}