"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Pencil, Users, Check, FileText, Send, RefreshCw, Calendar, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { updateGameCoach, updateGameJersey, updateGameGroup } from "@/app/(dashboard)/game-day/[id]/actions"

export interface GameRow {
  id: string
  day?: string
  time: string
  homeTeam: string
  awayTeam: string
  location: string
  facility: string
  field: string
  coach: string
  coachId?: string
  jersey: string
  jerseyColor?: string
  jerseyColorId?: string
  format: string
}

export interface GroupGamesRow {
  id: string
  groupName: string
  groupLead: string
  rosterStatus: "draft" | "published"
  publishedAt?: string
  publishedBy?: string
  games: GameRow[]
}

interface GameDayTabsProps {
  gameDayId: string
  gameDayName: string
  groupGames: GroupGamesRow[]
  coaches: { id: string; name: string }[]
  jerseyColors: { id: string; name: string; color: string }[]
}

function parseTime(time: string): number {
  if (time.includes(" ")) {
    const [timePart, period] = time.split(" ")
    const [hours, minutes] = timePart.split(":").map(Number)
    let hour24 = hours
    if (period === "PM" && hours !== 12) hour24 += 12
    if (period === "AM" && hours === 12) hour24 = 0
    return hour24 * 60 + minutes
  }
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function parseDate(dateStr: string): number {
  return new Date(dateStr).getTime()
}

function sortGamesByDateAndTime(games: GameRow[]): GameRow[] {
  return [...games].sort((a, b) => {
    if (a.day && b.day) {
      const dateDiff = parseDate(a.day) - parseDate(b.day)
      if (dateDiff !== 0) return dateDiff
    }
    return parseTime(a.time) - parseTime(b.time)
  })
}

function hasMultipleDays(games: { day?: string }[]): boolean {
  const days = games.map(g => g.day).filter((day): day is string => !!day)
  return new Set(days).size > 1
}

interface GameWithGroup extends GameRow {
  groupName: string
}

function JerseyEditor({
  value,
  color,
  jerseyColors,
  onSave,
}: {
  value: string
  color?: string
  jerseyColors: { id: string; name: string; color: string }[]
  onSave: (id: string, name: string, color: string) => void
}) {
  const [open, setOpen] = useState(false)
  const currentColor = color ?? jerseyColors.find(j => j.name === value)?.color

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <Badge variant="outline" className="flex items-center gap-1.5">
            {currentColor && (
              <span
                className="size-2.5 rounded-full border"
                style={{ backgroundColor: currentColor }}
              />
            )}
            {value}
          </Badge>
          <Button variant="ghost" size="icon" className="size-6">
            <Pencil className="size-3" />
            <span className="sr-only">Edit Jersey</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2" align="start">
        <div className="flex flex-col gap-1">
          {jerseyColors.map((jersey) => (
            <button
              key={jersey.id}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                jersey.name === value && "bg-muted"
              )}
              onClick={() => { onSave(jersey.id, jersey.name, jersey.color); setOpen(false) }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-3 rounded-full border"
                  style={{ backgroundColor: jersey.color }}
                />
                <span>{jersey.name}</span>
              </div>
              {jersey.name === value && <Check className="size-4 text-primary" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function GroupEditor({
  value,
  groups,
  onSave,
}: {
  value: string
  groups: { id: string; groupName: string }[]
  onSave: (id: string, name: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <span>{value}</span>
          <Button variant="ghost" size="icon" className="size-6">
            <Pencil className="size-3" />
            <span className="sr-only">Edit Group</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-2" align="start">
        <div className="flex flex-col gap-1">
          {groups.map((group) => (
            <button
              key={group.id}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                group.groupName === value && "bg-muted"
              )}
              onClick={() => { onSave(group.id, group.groupName); setOpen(false) }}
            >
              <span>{group.groupName}</span>
              {group.groupName === value && <Check className="size-4 text-primary" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function CoachEditor({
  value,
  coaches,
  onSave,
}: {
  value: string
  coaches: { id: string; name: string }[]
  onSave: (id: string, name: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = coaches.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={open => { setOpen(open); if (!open) setSearch("") }}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <span>{value}</span>
          <Button variant="ghost" size="icon" className="size-6">
            <Pencil className="size-3" />
            <span className="sr-only">Edit Coach</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <Input
          placeholder="Search coaches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">No coaches found</p>
          ) : (
            filtered.map((coach) => (
              <button
                key={coach.id}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                  coach.name === value && "bg-muted"
                )}
                onClick={() => { onSave(coach.id, coach.name); setOpen(false); setSearch("") }}
              >
                <span>{coach.name}</span>
                {coach.name === value && <Check className="size-4 text-primary" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function GameDayTabs({ gameDayId, gameDayName, groupGames, coaches, jerseyColors }: GameDayTabsProps) {
  const [gameData, setGameData] = useState<GroupGamesRow[]>(groupGames)
  const [, startTransition] = useTransition()

  const allGroups = gameData.map(g => ({ id: g.id, groupName: g.groupName }))

  const allGamesWithGroup: GameWithGroup[] = gameData.flatMap(group =>
    group.games.map(game => ({ ...game, groupName: group.groupName }))
  )

  const gamesByCoach = allGamesWithGroup.reduce((acc, game) => {
    if (!acc[game.coach]) acc[game.coach] = []
    acc[game.coach].push(game)
    return acc
  }, {} as Record<string, GameWithGroup[]>)

  const coachNames = Object.keys(gamesByCoach).sort()

  const updateCoach = (gameId: string, coachId: string, coachName: string) => {
    setGameData(prev => prev.map(group => ({
      ...group,
      games: group.games.map(game =>
        game.id === gameId ? { ...game, coach: coachName, coachId } : game
      )
    })))
    startTransition(() => updateGameCoach(gameId, coachId))
  }

  const updateJersey = (gameId: string, jerseyColorId: string, jerseyName: string, jerseyColor: string) => {
    setGameData(prev => prev.map(group => ({
      ...group,
      games: group.games.map(game =>
        game.id === gameId ? { ...game, jersey: jerseyName, jerseyColorId, jerseyColor } : game
      )
    })))
    startTransition(() => updateGameJersey(gameId, jerseyColorId))
  }

  const updateGroup = (gameId: string, oldGroupName: string, newGdgId: string, newGroupName: string) => {
    if (oldGroupName === newGroupName) return
    setGameData(prev => {
      let gameToMove: GameRow | null = null
      const updated = prev.map(group => {
        if (group.groupName === oldGroupName) {
          const game = group.games.find(g => g.id === gameId)
          if (game) gameToMove = game
          return { ...group, games: group.games.filter(g => g.id !== gameId) }
        }
        return group
      })
      if (gameToMove) {
        return updated.map(group =>
          group.groupName === newGroupName
            ? { ...group, games: [...group.games, gameToMove!] }
            : group
        )
      }
      return updated
    })
    startTransition(() => updateGameGroup(gameId, newGdgId))
  }

  return (
    <Tabs defaultValue="by-group" className="w-full">
      <TabsList>
        <TabsTrigger value="by-group">By Group</TabsTrigger>
        <TabsTrigger value="by-coach">By Coach</TabsTrigger>
      </TabsList>

      <TabsContent value="by-group" className="mt-6">
        <div className="flex flex-col gap-8">
          {gameData.map((group) => {
            const multipleDays = hasMultipleDays(group.games)
            const sortedGames = sortGamesByDateAndTime(group.games)
            const shownDates = new Set<string>()

            return (
              <div key={group.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{group.groupName}</h2>
                      <Badge
                        variant={group.rosterStatus === "published" ? "default" : "secondary"}
                        className={group.rosterStatus === "published" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}
                      >
                        <FileText className="mr-1 size-3" />
                        {group.rosterStatus === "published" ? "Roster Published" : "Roster Draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span>Group Lead: {group.groupLead}</span>
                      <Button variant="ghost" size="icon" className="size-6">
                        <Pencil className="size-3" />
                        <span className="sr-only">Edit Group Lead</span>
                      </Button>
                    </div>
                    {group.rosterStatus === "published" && group.publishedAt && group.publishedBy && (
                      <p className="text-xs text-muted-foreground">
                        Published {group.publishedAt} by {group.publishedBy}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Roster" asChild>
                      <Link href={`/game-day/${gameDayId}/roster?group=${group.groupName}`}>
                        <Users className="size-4" />
                        <span className="sr-only">View Roster</span>
                      </Link>
                    </Button>
                    {group.rosterStatus === "draft" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm">
                            <Send className="mr-2 size-4" />
                            Publish
                            <ChevronDown className="ml-2 size-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Calendar className="mr-2 size-4" />
                            Publish Schedule Only
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 size-4" />
                            Publish Schedule and Roster
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="mr-2 size-4" />
                            Update
                            <ChevronDown className="ml-2 size-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Calendar className="mr-2 size-4" />
                            Update Schedule Only
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 size-4" />
                            Update Schedule and Roster
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {multipleDays && <TableHead className="w-28">Date</TableHead>}
                        <TableHead className="w-24">Time</TableHead>
                        <TableHead>Home Team</TableHead>
                        <TableHead>Away Team</TableHead>
                        <TableHead>Facility</TableHead>
                        <TableHead className="w-28">Field</TableHead>
                        <TableHead>Coach</TableHead>
                        <TableHead className="w-32">Jersey</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedGames.map((game) => {
                        let dateDisplay: string | null = null
                        if (multipleDays && game.day && !shownDates.has(game.day)) {
                          shownDates.add(game.day)
                          dateDisplay = game.day
                        }
                        return (
                          <TableRow key={game.id}>
                            {multipleDays && (
                              <TableCell className="font-medium text-muted-foreground">
                                {dateDisplay || ""}
                              </TableCell>
                            )}
                            <TableCell className="font-medium">{game.time}</TableCell>
                            <TableCell>{game.homeTeam}</TableCell>
                            <TableCell>{game.awayTeam}</TableCell>
                            <TableCell className="text-muted-foreground">{game.facility}</TableCell>
                            <TableCell className="text-muted-foreground">{game.field}</TableCell>
                            <TableCell>
                              <CoachEditor
                                value={game.coach}
                                coaches={coaches}
                                onSave={(id, name) => updateCoach(game.id, id, name)}
                              />
                            </TableCell>
                            <TableCell>
                              <JerseyEditor
                                value={game.jersey}
                                color={game.jerseyColor}
                                jerseyColors={jerseyColors}
                                onSave={(id, name, color) => updateJersey(game.id, id, name, color)}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )
          })}
        </div>
      </TabsContent>

      <TabsContent value="by-coach" className="mt-6">
        <div className="flex flex-col gap-8">
          {coachNames.map((coachName) => {
            const coachGames = gamesByCoach[coachName]
            const sortedGames = sortGamesByDateAndTime(coachGames)
            const multipleDays = hasMultipleDays(coachGames)
            const shownDates = new Set<string>()

            return (
              <div key={coachName} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{coachName}</h2>
                  <Badge variant="secondary">{coachGames.length} games</Badge>
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {multipleDays && <TableHead className="w-28">Date</TableHead>}
                        <TableHead className="w-24">Time</TableHead>
                        <TableHead>Home Team</TableHead>
                        <TableHead>Away Team</TableHead>
                        <TableHead>Facility</TableHead>
                        <TableHead className="w-28">Field</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead className="w-32">Jersey</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedGames.map((game) => {
                        let dateDisplay: string | null = null
                        if (multipleDays && game.day && !shownDates.has(game.day)) {
                          shownDates.add(game.day)
                          dateDisplay = game.day
                        }
                        return (
                          <TableRow key={game.id}>
                            {multipleDays && (
                              <TableCell className="font-medium text-muted-foreground">
                                {dateDisplay || ""}
                              </TableCell>
                            )}
                            <TableCell className="font-medium">{game.time}</TableCell>
                            <TableCell>{game.homeTeam}</TableCell>
                            <TableCell>{game.awayTeam}</TableCell>
                            <TableCell className="text-muted-foreground">{game.facility}</TableCell>
                            <TableCell className="text-muted-foreground">{game.field}</TableCell>
                            <TableCell>
                              <GroupEditor
                                value={game.groupName}
                                groups={allGroups}
                                onSave={(id, name) => updateGroup(game.id, game.groupName, id, name)}
                              />
                            </TableCell>
                            <TableCell>
                              <JerseyEditor
                                value={game.jersey}
                                color={game.jerseyColor}
                                jerseyColors={jerseyColors}
                                onSave={(id, name, color) => updateJersey(game.id, id, name, color)}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )
          })}
        </div>
      </TabsContent>
    </Tabs>
  )
}
