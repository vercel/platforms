"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Pencil, Users, Check, FileText, Send, RefreshCw, Calendar,
  ChevronDown, FileDown, Plus, MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  updateGameCoach, updateGameJersey, updateGameGroup,
  updateGroupLead, addGame, updateGame,
} from "@/app/(dashboard)/game-day/[id]/actions"

export interface GameRow {
  id: string
  day?: string
  time: string
  homeTeam: string
  awayTeam: string
  location: string
  locationId?: string
  facility: string
  field: string
  coach: string
  coachId?: string
  jersey: string
  jerseyColor?: string
  jerseyColorId?: string
  format: string
  rosterCount: number
  rawDate?: string
  rawTime?: string
}

export interface GroupGamesRow {
  id: string
  groupName: string
  groupLead: string
  groupLeadId?: string
  groupCoaches: { id: string; name: string }[]
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
  locations: { id: string; name: string }[]
  canEdit?: boolean
}

interface GameFormState {
  date: string
  time: string
  homeTeam: string
  awayTeam: string
  locationId: string
  field: string
  coachId: string
  jerseyColorId: string
  format: string
}

const EMPTY_FORM: GameFormState = {
  date: '', time: '', homeTeam: '', awayTeam: '',
  locationId: '', field: '', coachId: '', jerseyColorId: '', format: '',
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
  groupId: string
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

function GroupLeadEditor({
  value,
  leadId,
  groupCoaches,
  allCoaches,
  onSave,
}: {
  value: string
  leadId?: string
  groupCoaches: { id: string; name: string }[]
  allCoaches: { id: string; name: string }[]
  onSave: (id: string, name: string) => void
}) {
  const [open, setOpen] = useState(false)

  const groupCoachIds = new Set(groupCoaches.map(c => c.id))
  const otherCoaches = allCoaches.filter(c => !groupCoachIds.has(c.id))

  function Coach({ coach }: { coach: { id: string; name: string } }) {
    return (
      <button
        className={cn(
          "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted",
          coach.id === leadId && "bg-muted"
        )}
        onClick={() => { onSave(coach.id, coach.name); setOpen(false) }}
      >
        <span>{coach.name}</span>
        {coach.id === leadId && <Check className="size-4 text-primary" />}
      </button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <span>{value || "—"}</span>
          <Button variant="ghost" size="icon" className="size-6">
            <Pencil className="size-3" />
            <span className="sr-only">Change Group Lead</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="flex flex-col gap-0.5">
          {groupCoaches.length > 0 && (
            <>
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Group Coaches</p>
              {groupCoaches.map(c => <Coach key={c.id} coach={c} />)}
            </>
          )}
          {otherCoaches.length > 0 && (
            <>
              {groupCoaches.length > 0 && <div className="my-1 border-t" />}
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Other Coaches</p>
              {otherCoaches.map(c => <Coach key={c.id} coach={c} />)}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function GameFormDialog({
  open,
  mode,
  form,
  onFormChange,
  onSubmit,
  onClose,
  isPending,
  coaches,
  jerseyColors,
  locations,
}: {
  open: boolean
  mode: 'add' | 'edit'
  form: GameFormState
  onFormChange: (field: keyof GameFormState, value: string) => void
  onSubmit: () => void
  onClose: () => void
  isPending: boolean
  coaches: { id: string; name: string }[]
  jerseyColors: { id: string; name: string; color: string }[]
  locations: { id: string; name: string }[]
}) {
  const isValid = !!form.date && !!form.time && !!form.homeTeam.trim() && !!form.awayTeam.trim()

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Game' : 'Edit Game'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Date</FieldLabel>
              <Input
                type="date"
                value={form.date}
                onChange={e => onFormChange('date', e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Time</FieldLabel>
              <Input
                type="time"
                value={form.time}
                onChange={e => onFormChange('time', e.target.value)}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Home Team</FieldLabel>
              <Input
                value={form.homeTeam}
                onChange={e => onFormChange('homeTeam', e.target.value)}
                placeholder="Home team name"
              />
            </Field>
            <Field>
              <FieldLabel>Away Team</FieldLabel>
              <Input
                value={form.awayTeam}
                onChange={e => onFormChange('awayTeam', e.target.value)}
                placeholder="Away team name"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Location</FieldLabel>
              <Select value={form.locationId || '_none'} onValueChange={v => onFormChange('locationId', v === '_none' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">— None —</SelectItem>
                  {locations.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Field</FieldLabel>
              <Input
                value={form.field}
                onChange={e => onFormChange('field', e.target.value)}
                placeholder="e.g. Field 1"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Coach</FieldLabel>
              <Select value={form.coachId || '_none'} onValueChange={v => onFormChange('coachId', v === '_none' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">— None —</SelectItem>
                  {coaches.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Jersey Color</FieldLabel>
              <Select value={form.jerseyColorId || '_none'} onValueChange={v => onFormChange('jerseyColorId', v === '_none' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">— None —</SelectItem>
                  {jerseyColors.map(j => (
                    <SelectItem key={j.id} value={j.id}>
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full border inline-block" style={{ backgroundColor: j.color }} />
                        {j.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel>Format</FieldLabel>
            <Input
              value={form.format}
              onChange={e => onFormChange('format', e.target.value)}
              placeholder="e.g. 7v7"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!isValid || isPending}>
            {mode === 'add' ? 'Add Game' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function GameDayTabs({
  gameDayId, gameDayName, groupGames, coaches, jerseyColors, locations, canEdit = true,
}: GameDayTabsProps) {
  const router = useRouter()
  const [gameData, setGameData] = useState<GroupGamesRow[]>(groupGames)
  const [isPending, startTransition] = useTransition()

  // Sync local state when server data changes (after add/edit + router.refresh())
  useEffect(() => {
    setGameData(groupGames)
  }, [groupGames])

  // Game form dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const [addGroupId, setAddGroupId] = useState<string>('')
  const [editGameId, setEditGameId] = useState<string>('')
  const [gameForm, setGameForm] = useState<GameFormState>(EMPTY_FORM)

  function updateForm(field: keyof GameFormState, value: string) {
    setGameForm(f => ({ ...f, [field]: value }))
  }

  function openAddDialog(groupId: string) {
    setDialogMode('add')
    setAddGroupId(groupId)
    setEditGameId('')
    setGameForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  function openEditDialog(game: GameRow) {
    setDialogMode('edit')
    setEditGameId(game.id)
    setAddGroupId('')
    setGameForm({
      date: game.rawDate ?? '',
      time: game.rawTime ?? '',
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      locationId: game.locationId ?? '',
      field: game.field,
      coachId: game.coachId ?? '',
      jerseyColorId: game.jerseyColorId ?? '',
      format: game.format,
    })
    setDialogOpen(true)
  }

  function handleGameSubmit() {
    startTransition(async () => {
      if (dialogMode === 'add') {
        await addGame(addGroupId, gameDayId, {
          gameDate: gameForm.date,
          gameTime: gameForm.time,
          homeTeam: gameForm.homeTeam,
          awayTeam: gameForm.awayTeam,
          field: gameForm.field,
          locationId: gameForm.locationId,
          coachId: gameForm.coachId,
          jerseyColorId: gameForm.jerseyColorId,
          format: gameForm.format,
        })
      } else {
        await updateGame(editGameId, gameDayId, {
          gameDate: gameForm.date,
          gameTime: gameForm.time,
          homeTeam: gameForm.homeTeam,
          awayTeam: gameForm.awayTeam,
          field: gameForm.field,
          locationId: gameForm.locationId,
          coachId: gameForm.coachId,
          jerseyColorId: gameForm.jerseyColorId,
          format: gameForm.format,
        })
      }
      setDialogOpen(false)
      router.refresh()
    })
  }

  const allGroups = gameData.map(g => ({ id: g.id, groupName: g.groupName }))

  const allGamesWithGroup: GameWithGroup[] = gameData.flatMap(group =>
    group.games.map(game => ({ ...game, groupName: group.groupName, groupId: group.id }))
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

  const changeGroupLead = (groupId: string, coachId: string, coachName: string) => {
    setGameData(prev => prev.map(group =>
      group.id === groupId
        ? { ...group, groupLead: coachName, groupLeadId: coachId }
        : group
    ))
    startTransition(() => updateGroupLead(groupId, gameDayId, coachId))
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
    <>
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
              const colSpan = 8 + (multipleDays ? 1 : 0) + (canEdit ? 1 : 0)

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
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>Group Lead:</span>
                        {canEdit ? (
                          <GroupLeadEditor
                            value={group.groupLead}
                            leadId={group.groupLeadId}
                            groupCoaches={group.groupCoaches}
                            allCoaches={coaches}
                            onSave={(id, name) => changeGroupLead(group.id, id, name)}
                          />
                        ) : (
                          <span className="ml-1">{group.groupLead || "—"}</span>
                        )}
                      </div>
                      {group.rosterStatus === "published" && group.publishedAt && group.publishedBy && (
                        <p className="text-xs text-muted-foreground">
                          Published {group.publishedAt} by {group.publishedBy}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="View Roster" asChild>
                        <Link href={`/game-day/${gameDayId}/roster?group=${group.groupName}`}>
                          <Users className="size-4" />
                          <span className="sr-only">View Roster</span>
                        </Link>
                      </Button>
                      {group.rosterStatus === "published" && (
                        <Button variant="ghost" size="icon" title="Download PDF" asChild>
                          <a
                            href={`/game-day/${gameDayId}/groups/${group.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileDown className="size-4" />
                            <span className="sr-only">Download PDF</span>
                          </a>
                        </Button>
                      )}
                      {canEdit && (group.rosterStatus === "draft" ? (
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
                      ))}
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
                          <TableHead className="w-20">Rostered</TableHead>
                          <TableHead className="w-32">Jersey</TableHead>
                          {canEdit && <TableHead className="w-12 text-right">Actions</TableHead>}
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
                                {canEdit ? (
                                  <CoachEditor
                                    value={game.coach}
                                    coaches={coaches}
                                    onSave={(id, name) => updateCoach(game.id, id, name)}
                                  />
                                ) : (
                                  <span className="text-sm">{game.coach || '—'}</span>
                                )}
                              </TableCell>
                              <TableCell className="text-sm tabular-nums">
                                {game.rosterCount > 0
                                  ? <span className="font-medium">{game.rosterCount}</span>
                                  : <span className="text-muted-foreground">—</span>}
                              </TableCell>
                              <TableCell>
                                {canEdit ? (
                                  <JerseyEditor
                                    value={game.jersey}
                                    color={game.jerseyColor}
                                    jerseyColors={jerseyColors}
                                    onSave={(id, name, color) => updateJersey(game.id, id, name, color)}
                                  />
                                ) : (
                                  <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                                    {game.jerseyColor && (
                                      <span
                                        className="size-2.5 rounded-full border"
                                        style={{ backgroundColor: game.jerseyColor }}
                                      />
                                    )}
                                    {game.jersey || '—'}
                                  </Badge>
                                )}
                              </TableCell>
                              {canEdit && (
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="size-8">
                                        <MoreHorizontal className="size-4" />
                                        <span className="sr-only">Game actions</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => openEditDialog(game)}>
                                        <Pencil className="mr-2 size-4" />
                                        Edit
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              )}
                            </TableRow>
                          )
                        })}
                        {canEdit && (
                          <TableRow>
                            <TableCell colSpan={colSpan} className="p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-muted-foreground hover:text-foreground"
                                onClick={() => openAddDialog(group.id)}
                              >
                                <Plus className="mr-2 size-4" />
                                Add Game
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
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
                          <TableHead className="w-20">Rostered</TableHead>
                          <TableHead className="w-32">Jersey</TableHead>
                          {canEdit && <TableHead className="w-12 text-right">Actions</TableHead>}
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
                                {canEdit ? (
                                  <GroupEditor
                                    value={game.groupName}
                                    groups={allGroups}
                                    onSave={(id, name) => updateGroup(game.id, game.groupName, id, name)}
                                  />
                                ) : (
                                  <span className="text-sm">{game.groupName}</span>
                                )}
                              </TableCell>
                              <TableCell className="text-sm tabular-nums">
                                {game.rosterCount > 0
                                  ? <span className="font-medium">{game.rosterCount}</span>
                                  : <span className="text-muted-foreground">—</span>}
                              </TableCell>
                              <TableCell>
                                {canEdit ? (
                                  <JerseyEditor
                                    value={game.jersey}
                                    color={game.jerseyColor}
                                    jerseyColors={jerseyColors}
                                    onSave={(id, name, color) => updateJersey(game.id, id, name, color)}
                                  />
                                ) : (
                                  <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                                    {game.jerseyColor && (
                                      <span
                                        className="size-2.5 rounded-full border"
                                        style={{ backgroundColor: game.jerseyColor }}
                                      />
                                    )}
                                    {game.jersey || '—'}
                                  </Badge>
                                )}
                              </TableCell>
                              {canEdit && (
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="size-8">
                                        <MoreHorizontal className="size-4" />
                                        <span className="sr-only">Game actions</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => openEditDialog(game)}>
                                        <Pencil className="mr-2 size-4" />
                                        Edit
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              )}
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

      <GameFormDialog
        open={dialogOpen}
        mode={dialogMode}
        form={gameForm}
        onFormChange={updateForm}
        onSubmit={handleGameSubmit}
        onClose={() => setDialogOpen(false)}
        isPending={isPending}
        coaches={coaches}
        jerseyColors={jerseyColors}
        locations={locations}
      />
    </>
  )
}
