import { IconCpu, IconAlertTriangle, IconRocket, IconClock } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* 1. Agent Performance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Agent Success Rate</CardDescription>
          <CardTitle className="text-2xl text-primary font-semibold tabular-nums @[250px]/card:text-3xl">
            94.2%
          </CardTitle>
          <CardAction>
            <Badge className="bg-primary text-primary-foreground" variant="outline">
              <IconRocket className="mr-1" />
              +3.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Improved task accuracy <IconRocket className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on last 500 executions
          </div>
        </CardFooter>
      </Card>

      {/* 2. System Efficiency */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Response Time</CardDescription>
          <CardTitle className="text-2xl text-secondary font-semibold tabular-nums @[250px]/card:text-3xl">
            1.8s
          </CardTitle>
          <CardAction>
            <Badge className="bg-secondary text-secondary-foreground" variant="outline">
              <IconClock className="mr-1" />
              -0.4s
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Faster than last week <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground">Latency trend improving</div>
        </CardFooter>
      </Card>

      {/* 3. Active Agents */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Agents</CardDescription>
          <CardTitle className="text-2xl text-primary font-semibold tabular-nums @[250px]/card:text-3xl">
            28
          </CardTitle>
          <CardAction>
            <Badge className="bg-primary text-primary-foreground" variant="outline">
              <IconCpu className="mr-1" />
              +2 new
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Deployment stable <IconCpu className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Running across all clusters
          </div>
        </CardFooter>
      </Card>

      {/* 4. Issues & Alerts */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription >System Alerts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-destructive">
            3
          </CardTitle>
          <CardAction>
            <Badge variant="destructive">
              <IconAlertTriangle className="mr-1" />
              +1
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-destructive">
            Check logs immediately <IconAlertTriangle className="size-4" />
          </div>
          <div className="text-muted-foreground">
            1 agent timeout, 2 auth errors
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
