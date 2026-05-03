"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Pencil, Check } from "lucide-react"
import { type Game } from "@/lib/game-day-data"
import { coaches, jerseyColors } from "@/lib/settings-data"
import { cn } from "@/lib/utils"

interface EditableGameTableProps {
  games: Game[]
  showDateColumn?: boolean
}

function parseTime(time: string): number {
  const [timePart, period] = time.split(" ")
  const [hours, minutes] = timePart.split(":").map(Number)
  let hour24 = hours
  if (period === "PM" && hours !== 12) hour24 += 12
  if (period === "AM" && hours === 12) hour24 = 0
  return hour24 * 60 + minutes
}

function parseDate(dateStr: string): number {
  return new Date(dateStr).getTime()
}

function sortGamesByDateAndTime(games: Game[]): Game[] {
  return [...games].sort((a, b) => {
    // First sort by date if available
    if (a.day && b.day) {
      const dateDiff = parseDate(a.day) - parseDate(b.day)
      if (dateDiff !== 0) return dateDiff
    }
    // Then sort by time
    return parseTime(a.time) - parseTime(b.time)
  })
}

function CoachEditor({ value, onSave }: { value: string; onSave: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCoaches = coaches.filter(coach =>
    coach.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleSelect = (coachName: string) => {
    onSave(coachName)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer group">
          <span>{value}</span>
          <Button variant="ghost" size="icon" className="size-6">
            <Pencil className="size-3" />
            <span className="sr-only">Edit Coach</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <Input
          ref={inputRef}
          placeholder="Search coaches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-48 overflow-y-auto">
          {filteredCoaches.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">No coaches found</p>
          ) : (
            filteredCoaches.map((coach) => (
              <button
                key={coach.id}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                  coach.name === value && "bg-muted"
                )}
                onClick={() => handleSelect(coach.name)}
              >
                <div className="flex flex-col items-start">
                  <span>{coach.name}</span>
                  <span className="text-xs text-muted-foreground">{coach.role}</span>
                </div>
                {coach.name === value && <Check className="size-4 text-primary" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function JerseyEditor({ value, onSave }: { value: string; onSave: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const currentColor = jerseyColors.find(j => j.name === value)

  const handleSelect = (jerseyName: string) => {
    onSave(jerseyName)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <Badge variant="outline" className="flex items-center gap-1.5">
            {currentColor && (
              <span 
                className="size-2.5 rounded-full border" 
                style={{ backgroundColor: currentColor.color }} 
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
              onClick={() => handleSelect(jersey.name)}
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

export function EditableGameTable({ games, showDateColumn = false }: EditableGameTableProps) {
  const [gameData, setGameData] = useState(games)

  const updateCoach = (gameId: number, newCoach: string) => {
    setGameData(prev => prev.map(game => 
      game.id === gameId ? { ...game, coach: newCoach } : game
    ))
  }

  const updateJersey = (gameId: number, newJersey: string) => {
    setGameData(prev => prev.map(game => 
      game.id === gameId ? { ...game, jersey: newJersey } : game
    ))
  }

  const sortedGames = sortGamesByDateAndTime(gameData)
  
  // Track which dates have already been shown
  const shownDates = new Set<string>()
  
  const getDateDisplay = (game: Game): string | null => {
    if (!showDateColumn || !game.day) return null
    if (shownDates.has(game.day)) return null
    shownDates.add(game.day)
    return game.day
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {showDateColumn && <TableHead className="w-28">Date</TableHead>}
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
            const dateDisplay = getDateDisplay(game)
            return (
              <TableRow key={game.id}>
                {showDateColumn && (
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
                    onSave={(newCoach) => updateCoach(game.id, newCoach)} 
                  />
                </TableCell>
                <TableCell>
                  <JerseyEditor 
                    value={game.jersey} 
                    onSave={(newJersey) => updateJersey(game.id, newJersey)} 
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
