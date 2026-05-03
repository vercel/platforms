'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, Save, GripVertical, UserX, MoreHorizontal,
  History, StickyNote, Copy,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { saveRoster } from './actions'

// ── Types ──────────────────────────────────────────────────────────────────

export type PlayerInfo = {
  id: string
  first_name: string
  last_name: string
  group_id: string
}

export type GameInfo = {
  id: string
  day?: string
  time: string
  homeTeam: string
  awayTeam: string
  field: string
}

export type GroupData = {
  id: string        // game_day_group_id
  groupName: string
  groupId: string   // groups.id
  games: GameInfo[]
}

export type InitialEntry = {
  game_id: string
  player_id: string
  notes: string | null
  is_unavailable: boolean
}

type Assignment = { gameId: string; playerIds: string[] }
type Note = { playerId: string; gameId: string; note: string }
type DragSource = 'available' | 'unavailable' | string // string = gameId
type DraggedPlayer = { player: PlayerInfo; source: DragSource }

function fmt(p: PlayerInfo) {
  return `${p.first_name} ${p.last_name.charAt(0)}.`
}

// ── GameCard ───────────────────────────────────────────────────────────────

function GameCard({
  game,
  gamePlayers,
  otherGames,
  dragged,
  onDragStart,
  onDragEnd,
  onDropOnGame,
  onAddToAnother,
  getNote,
  editingNote,
  noteText,
  setEditingNote,
  setNoteText,
  onSaveNote,
}: {
  game: GameInfo
  gamePlayers: PlayerInfo[]
  otherGames: GameInfo[]
  dragged: DraggedPlayer | null
  onDragStart: (p: PlayerInfo, src: DragSource) => void
  onDragEnd: () => void
  onDropOnGame: (gameId: string) => void
  onAddToAnother: (playerId: string, targetGameId: string) => void
  getNote: (playerId: string, gameId: string) => string | undefined
  editingNote: { playerId: string; gameId: string } | null
  noteText: string
  setEditingNote: (v: { playerId: string; gameId: string } | null) => void
  setNoteText: (v: string) => void
  onSaveNote: (playerId: string, gameId: string) => void
}) {
  return (
    <Card
      className={`transition-colors ${dragged ? 'border-dashed border-primary/50' : ''}`}
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('bg-primary/5') }}
      onDragLeave={e => e.currentTarget.classList.remove('bg-primary/5')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('bg-primary/5'); onDropOnGame(game.id) }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <div className="flex items-center justify-between">
            <span>{game.homeTeam} vs {game.awayTeam}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">{gamePlayers.length} players</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-7">
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Game options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <History className="mr-2 size-4" />
                    No previous games available
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {game.day && `${game.day} · `}{game.time}{game.field && ` · ${game.field}`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="min-h-[100px] rounded-md border border-dashed p-2">
          {gamePlayers.length === 0 ? (
            <p className="flex h-[84px] items-center justify-center text-sm text-muted-foreground">
              Drag players here
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {gamePlayers.map(player => {
                const note = getNote(player.id, game.id)
                const isEditing = editingNote?.playerId === player.id && editingNote?.gameId === game.id
                return (
                  <div
                    key={player.id}
                    draggable
                    onDragStart={() => onDragStart(player, game.id)}
                    onDragEnd={onDragEnd}
                    className="group flex cursor-grab items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm active:cursor-grabbing"
                  >
                    <GripVertical className="size-3 text-muted-foreground" />
                    <span className="flex items-center gap-1">
                      {fmt(player)}
                      {note && <span className="text-xs text-muted-foreground">({note})</span>}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1 size-5 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreHorizontal className="size-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <Popover
                          open={isEditing}
                          onOpenChange={open => {
                            if (open) { setEditingNote({ playerId: player.id, gameId: game.id }); setNoteText(note ?? '') }
                            else { setEditingNote(null); setNoteText('') }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                              <StickyNote className="mr-2 size-4" />
                              {note ? 'Edit Roster Note' : 'Add Roster Note'}
                            </DropdownMenuItem>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-3" align="start">
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">Roster Note (max 20 chars)</label>
                              <Input
                                value={noteText}
                                onChange={e => setNoteText(e.target.value.slice(0, 20))}
                                placeholder="e.g., GK, Captain"
                                maxLength={20}
                                autoFocus
                              />
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{noteText.length}/20</span>
                                <Button size="sm" onClick={() => onSaveNote(player.id, game.id)}>Save</Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        {otherGames.length > 0 && (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Copy className="mr-2 size-4" />
                              Add to Another Game
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-56">
                              {otherGames.map(og => (
                                <DropdownMenuItem key={og.id} onClick={() => onAddToAnother(player.id, og.id)}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{og.homeTeam} vs {og.awayTeam}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {og.day && `${og.day} · `}{og.time}
                                    </span>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export function RosterClient({
  gameDayId,
  gameDayName,
  groups,
  players,
  initialEntries,
  initialGroup,
}: {
  gameDayId: string
  gameDayName: string
  groups: GroupData[]
  players: PlayerInfo[]
  initialEntries: InitialEntry[]
  initialGroup: string | null
}) {
  const [isPending, startTransition] = useTransition()

  // Derive initial state from DB entries
  const initAssignments: Assignment[] = []
  const initUnavailable: string[] = []
  const initNotes: Note[] = []

  for (const entry of initialEntries) {
    if (entry.is_unavailable) {
      if (!initUnavailable.includes(entry.player_id)) initUnavailable.push(entry.player_id)
    } else {
      const existing = initAssignments.find(a => a.gameId === entry.game_id)
      if (existing) { existing.playerIds.push(entry.player_id) }
      else { initAssignments.push({ gameId: entry.game_id, playerIds: [entry.player_id] }) }
      if (entry.notes) initNotes.push({ playerId: entry.player_id, gameId: entry.game_id, note: entry.notes })
    }
  }

  const [assignments, setAssignments] = useState<Assignment[]>(initAssignments)
  const [unavailable, setUnavailable] = useState<string[]>(initUnavailable)
  const [dragged, setDragged] = useState<DraggedPlayer | null>(null)
  const [activeGroup, setActiveGroup] = useState<string | null>(
    initialGroup ?? (groups[0]?.groupName ?? null)
  )
  const [notes, setNotes] = useState<Note[]>(initNotes)
  const [editingNote, setEditingNote] = useState<{ playerId: string; gameId: string } | null>(null)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    if (!activeGroup && groups.length > 0) setActiveGroup(groups[0].groupName)
  }, [activeGroup, groups])

  const currentGroup = groups.find(g => g.groupName === activeGroup)
  const groupPlayers = players.filter(p => p.group_id === currentGroup?.groupId)

  const assignedIds = assignments.flatMap(a => a.playerIds)
  const availablePlayers = groupPlayers.filter(p => !assignedIds.includes(p.id) && !unavailable.includes(p.id))
  const unavailablePlayers = groupPlayers.filter(p => unavailable.includes(p.id))

  function getPlayersForGame(gameId: string): PlayerInfo[] {
    const a = assignments.find(a => a.gameId === gameId)
    if (!a) return []
    return a.playerIds.map(id => players.find(p => p.id === id)).filter(Boolean) as PlayerInfo[]
  }

  function getNote(playerId: string, gameId: string) {
    return notes.find(n => n.playerId === playerId && n.gameId === gameId)?.note
  }

  // ── Drag handlers ────────────────────────────────────────────────────────

  function onDragStart(player: PlayerInfo, source: DragSource) {
    setDragged({ player, source })
  }

  function onDragEnd() { setDragged(null) }

  function removeFromSource(playerId: string, source: DragSource) {
    if (source === 'unavailable') {
      setUnavailable(prev => prev.filter(id => id !== playerId))
    } else if (source !== 'available') {
      setAssignments(prev => prev.map(a =>
        a.gameId === source ? { ...a, playerIds: a.playerIds.filter(id => id !== playerId) } : a
      ))
    }
  }

  function onDropOnGame(gameId: string) {
    if (!dragged) return
    const { player, source } = dragged
    removeFromSource(player.id, source)
    setAssignments(prev => {
      const ex = prev.find(a => a.gameId === gameId)
      if (ex) {
        if (ex.playerIds.includes(player.id)) return prev
        return prev.map(a => a.gameId === gameId ? { ...a, playerIds: [...a.playerIds, player.id] } : a)
      }
      return [...prev, { gameId, playerIds: [player.id] }]
    })
    setDragged(null)
  }

  function onDropOnUnavailable() {
    if (!dragged) return
    const { player, source } = dragged
    removeFromSource(player.id, source)
    if (!unavailable.includes(player.id)) setUnavailable(prev => [...prev, player.id])
    setDragged(null)
  }

  function onDropOnAvailable() {
    if (!dragged) return
    const { player, source } = dragged
    removeFromSource(player.id, source)
    setDragged(null)
  }

  function onAddToAnother(playerId: string, targetGameId: string) {
    setAssignments(prev => {
      const ex = prev.find(a => a.gameId === targetGameId)
      if (ex) {
        if (ex.playerIds.includes(playerId)) return prev
        return prev.map(a => a.gameId === targetGameId ? { ...a, playerIds: [...a.playerIds, playerId] } : a)
      }
      return [...prev, { gameId: targetGameId, playerIds: [playerId] }]
    })
  }

  function onSaveNote(playerId: string, gameId: string) {
    const trimmed = noteText.trim().slice(0, 20)
    setNotes(prev => {
      const filtered = prev.filter(n => !(n.playerId === playerId && n.gameId === gameId))
      return trimmed ? [...filtered, { playerId, gameId, note: trimmed }] : filtered
    })
    setEditingNote(null)
    setNoteText('')
  }

  function handleSave() {
    const flatAssignments = assignments.flatMap(a =>
      a.playerIds.map(playerId => ({
        gameId: a.gameId,
        playerId,
        notes: notes.find(n => n.gameId === a.gameId && n.playerId === playerId)?.note,
      }))
    )
    startTransition(() => saveRoster(gameDayId, flatAssignments, unavailable))
  }

  // ── Multi-day helpers ────────────────────────────────────────────────────

  function getUniqueDays(games: GameInfo[]) {
    const days = [...new Set(games.map(g => g.day).filter(Boolean) as string[])]
    return days.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  }

  function hasMultipleDays(games: GameInfo[]) {
    return getUniqueDays(games).length > 1
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/game-day/${gameDayId}`}>
              <ArrowLeft className="size-4" />
              <span className="sr-only">Back to Game Day</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Roster Builder</h1>
            <p className="text-sm text-muted-foreground">{gameDayName}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleSave} disabled={isPending}>
          <Save className="mr-2 size-4" />
          {isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>

      {/* Group tabs */}
      <div className="flex gap-2 border-b pb-2">
        {groups.map(g => (
          <Button
            key={g.id}
            variant={activeGroup === g.groupName ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveGroup(g.groupName)}
          >
            {g.groupName}
          </Button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Games area */}
        <div className="flex-1 overflow-auto">
          {currentGroup && (() => {
            const games = currentGroup.games
            const multiDay = hasMultipleDays(games)

            if (multiDay) {
              return (
                <div className="flex flex-col gap-6">
                  {getUniqueDays(games).map(day => (
                    <div key={day} className="flex flex-col gap-3">
                      <h3 className="sticky top-0 z-10 border-b bg-background py-2 text-sm font-semibold text-muted-foreground">
                        {day}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {games.filter(g => g.day === day).map(game => (
                          <GameCard
                            key={game.id}
                            game={game}
                            gamePlayers={getPlayersForGame(game.id)}
                            otherGames={games.filter(g => g.id !== game.id)}
                            dragged={dragged}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onDropOnGame={onDropOnGame}
                            onAddToAnother={onAddToAnother}
                            getNote={getNote}
                            editingNote={editingNote}
                            noteText={noteText}
                            setEditingNote={setEditingNote}
                            setNoteText={setNoteText}
                            onSaveNote={onSaveNote}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            }

            return (
              <div className="grid gap-4 md:grid-cols-2">
                {games.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    gamePlayers={getPlayersForGame(game.id)}
                    otherGames={games.filter(g => g.id !== game.id)}
                    dragged={dragged}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDropOnGame={onDropOnGame}
                    onAddToAnother={onAddToAnother}
                    getNote={getNote}
                    editingNote={editingNote}
                    noteText={noteText}
                    setEditingNote={setEditingNote}
                    setNoteText={setNoteText}
                    onSaveNote={onSaveNote}
                  />
                ))}
              </div>
            )
          })()}
        </div>

        {/* Right sidebar */}
        <div className="flex w-80 flex-col gap-4 border-l pl-4">
          {/* Available players */}
          <div
            className="flex flex-1 flex-col overflow-hidden rounded-lg border bg-card"
            onDragOver={e => { e.preventDefault(); if (dragged?.source !== 'available') e.currentTarget.classList.add('bg-primary/5') }}
            onDragLeave={e => e.currentTarget.classList.remove('bg-primary/5')}
            onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('bg-primary/5'); onDropOnAvailable() }}
          >
            <div className="border-b p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Available Players</h3>
                <Badge variant="secondary">{availablePlayers.length}</Badge>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
              {availablePlayers.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">All players assigned</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {availablePlayers.map(player => (
                    <div
                      key={player.id}
                      draggable
                      onDragStart={() => onDragStart(player, 'available')}
                      onDragEnd={onDragEnd}
                      className="flex cursor-grab items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-muted active:cursor-grabbing"
                    >
                      <GripVertical className="size-4 text-muted-foreground" />
                      <span className="flex-1">{fmt(player)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Unavailable players */}
          <div
            className={`flex h-1/3 flex-col rounded-lg border bg-muted/30 transition-colors ${
              dragged && dragged.source !== 'unavailable' ? 'border-dashed border-destructive/50' : ''
            }`}
            onDragOver={e => { e.preventDefault(); if (dragged?.source !== 'unavailable') e.currentTarget.classList.add('bg-destructive/5') }}
            onDragLeave={e => e.currentTarget.classList.remove('bg-destructive/5')}
            onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('bg-destructive/5'); onDropOnUnavailable() }}
          >
            <div className="border-b p-3">
              <div className="flex items-center gap-2">
                <UserX className="size-4 text-muted-foreground" />
                <h3 className="font-semibold">Unavailable</h3>
                <Badge variant="outline">{unavailablePlayers.length}</Badge>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
              {unavailablePlayers.length === 0 ? (
                <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Drag players here if unavailable
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {unavailablePlayers.map(player => (
                    <div
                      key={player.id}
                      draggable
                      onDragStart={() => onDragStart(player, 'unavailable')}
                      onDragEnd={onDragEnd}
                      className="flex cursor-grab items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-sm text-destructive active:cursor-grabbing"
                    >
                      <GripVertical className="size-3" />
                      {fmt(player)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
