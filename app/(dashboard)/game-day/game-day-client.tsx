"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NewGameDayWizard } from "@/components/new-game-day-wizard"
import { format, parseISO } from "date-fns"

export type GameDayRow = {
  id: string
  name: string
  start_date: string
  end_date: string | null
  status: "live" | "upcoming" | "completed"
  locations: { name: string } | null
  team_count: number
  player_count: number
}

export type WizardGroup = {
  id: string
  name: string
  leadCoachId: string | null
  teams: Array<{ id: string; name: string }>
}

export type WizardCoach = { id: string; name: string }
export type WizardLocation = { id: string; name: string; address: string | null }

type Filter = "active" | "past" | "all"

function statusBadge(status: GameDayRow["status"]) {
  switch (status) {
    case "live":
      return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Live</Badge>
    case "upcoming":
      return <Badge variant="secondary">Upcoming</Badge>
    case "completed":
      return <Badge variant="outline">Completed</Badge>
  }
}

function formatDateRange(start: string, end: string | null): string {
  const s = parseISO(start)
  if (!end) return format(s, "MMM d, yyyy")
  const e = parseISO(end)
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${format(s, "MMM d")} – ${format(e, "d, yyyy")}`
  }
  return `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`
}

type Props = {
  gameDays: GameDayRow[]
  groups: WizardGroup[]
  coaches: WizardCoach[]
  locations: WizardLocation[]
  accountId: string | null
}

export function GameDayClient({ gameDays, groups, coaches, locations, accountId }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>("active")

  const filtered = gameDays.filter(gd => {
    if (filter === "active") return gd.status === "live" || gd.status === "upcoming"
    if (filter === "past") return gd.status === "completed"
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Game Day</h1>
          <p className="text-muted-foreground">View and manage your game day records</p>
        </div>
        <NewGameDayWizard
          groups={groups}
          coaches={coaches}
          locations={locations}
          accountId={accountId}
        />
      </div>

      <div className="flex items-center gap-4">
        <ButtonGroup>
          <Button variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")}>
            Active
          </Button>
          <Button variant={filter === "past" ? "default" : "outline"} onClick={() => setFilter("past")}>
            Past
          </Button>
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All
          </Button>
        </ButtonGroup>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Team Count</TableHead>
              <TableHead className="text-right">Player Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((gd) => (
              <TableRow
                key={gd.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/game-day/${gd.id}`)}
              >
                <TableCell className="font-medium">{gd.name}</TableCell>
                <TableCell>{formatDateRange(gd.start_date, gd.end_date)}</TableCell>
                <TableCell>{statusBadge(gd.status)}</TableCell>
                <TableCell className="text-right">{gd.team_count}</TableCell>
                <TableCell className="text-right">{gd.player_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
