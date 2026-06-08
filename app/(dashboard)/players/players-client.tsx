'use client'

import { useState, useTransition, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus, MoreHorizontal, Archive, RotateCcw, Pencil, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { addPlayer, updatePlayer, archivePlayer, restorePlayer, setPlayerLevel } from './actions'

export type PlayerRow = {
  id: string
  first_name: string
  last_name: string
  pool_id: string
  status: 'active' | 'archived'
  player_level_id: string | null
  pools: { name: string } | null
  player_levels: { name: string; color: string | null } | null
}

export type PoolRow = {
  id: string
  name: string
}

export type PlayerLevelRow = {
  id: string
  name: string
  rank: number
  color: string | null
}

const PAGE_SIZE_OPTIONS = [25, 50, 100]

function LevelCell({
  player,
  playerLevels,
  onSelect,
}: {
  player: PlayerRow
  playerLevels: PlayerLevelRow[]
  onSelect: (playerId: string, levelId: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const level = player.player_levels

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 rounded px-1.5 py-1 text-sm transition-colors hover:bg-muted focus:outline-none">
          {level ? (
            <>
              {level.color && (
                <span
                  className="inline-block size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: level.color }}
                />
              )}
              <span className="text-foreground">{level.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="start">
        <div className="flex flex-col">
          <button
            className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            onClick={() => { onSelect(player.id, null); setOpen(false) }}
          >
            <span className="size-4" />
            — None —
          </button>
          {playerLevels.map(l => (
            <button
              key={l.id}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-muted"
              onClick={() => { onSelect(player.id, l.id); setOpen(false) }}
            >
              {player.player_level_id === l.id
                ? <Check className="size-4 shrink-0 text-primary" />
                : <span className="size-4 shrink-0" />
              }
              {l.color && (
                <span
                  className="inline-block size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: l.color }}
                />
              )}
              {l.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function fmtLastRostered(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffMs = today.getTime() - date.getTime()
  const diffDays = Math.round(diffMs / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function PlayersClient({
  players,
  pools,
  playerLevels,
  lastRosteredMap = {},
}: {
  players: PlayerRow[]
  pools: PoolRow[]
  playerLevels: PlayerLevelRow[]
  lastRosteredMap?: Record<string, string>
}) {
  const [isPending, startTransition] = useTransition()

  // Filters
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Add dialog
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', poolId: pools[0]?.id ?? '', levelId: '' })

  // Edit dialog
  const [editPlayer, setEditPlayer] = useState<PlayerRow | null>(null)
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', poolId: '', levelId: '' })

  // --- Filtering ---
  const filtered = useMemo(() => {
    return players
      .filter(p => (showArchived ? p.status === 'archived' : p.status === 'active'))
      .filter(p => !selectedPoolId || p.pool_id === selectedPoolId)
      .sort((a, b) => a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name))
  }, [players, showArchived, selectedPoolId])

  // --- Pagination ---
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  function setFilter(poolId: string | null) {
    setSelectedPoolId(poolId)
    setPage(1)
  }

  function setSize(size: number) {
    setPageSize(size)
    setPage(1)
  }

  // --- Add ---
  function handleAdd() {
    if (!addForm.firstName.trim() || !addForm.lastName.trim() || !addForm.poolId) return
    startTransition(async () => {
      await addPlayer(addForm.poolId, addForm.firstName, addForm.lastName)
      setAddOpen(false)
      setAddForm({ firstName: '', lastName: '', poolId: pools[0]?.id ?? '', levelId: '' })
    })
  }

  // --- Inline level ---
  function handleSetLevel(playerId: string, levelId: string | null) {
    startTransition(() => setPlayerLevel(playerId, levelId))
  }

  // --- Edit ---
  function openEdit(player: PlayerRow) {
    setEditPlayer(player)
    setEditForm({
      firstName: player.first_name,
      lastName: player.last_name,
      poolId: player.pool_id,
      levelId: player.player_level_id ?? '',
    })
  }

  function handleEdit() {
    if (!editPlayer || !editForm.firstName.trim() || !editForm.lastName.trim()) return
    startTransition(async () => {
      await updatePlayer(
        editPlayer.id,
        editForm.firstName,
        editForm.lastName,
        editForm.poolId,
        editForm.levelId || undefined,
      )
      setEditPlayer(null)
    })
  }

  const activeCount = players.filter(p => p.status === 'active').length
  const archivedCount = players.filter(p => p.status === 'archived').length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground">
            {showArchived
              ? `${archivedCount} archived player${archivedCount !== 1 ? 's' : ''}`
              : `${activeCount} active player${activeCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showArchived ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setShowArchived(!showArchived); setPage(1) }}
          >
            <Archive className="mr-2 size-4" />
            {showArchived ? 'Show Active' : 'Show Archived'}
          </Button>
          {!showArchived && (
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 size-4" />
              Add Player
            </Button>
          )}
        </div>
      </div>

      {/* Pool filter chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedPoolId === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(null)}
        >
          All Pools
        </Button>
        {pools.map(g => (
          <Button
            key={g.id}
            variant={selectedPoolId === g.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(g.id)}
          >
            {g.name}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last</TableHead>
              <TableHead>Age Group</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Last Rostered</TableHead>
              <TableHead className="w-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No players found.
                </TableCell>
              </TableRow>
            ) : paginated.map(player => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.first_name}</TableCell>
                <TableCell>{player.last_name.slice(0, 2)}.</TableCell>
                <TableCell>
                  <Badge variant="secondary">{player.pools?.name ?? '—'}</Badge>
                </TableCell>
                <TableCell>
                  <LevelCell player={player} playerLevels={playerLevels} onSelect={handleSetLevel} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {lastRosteredMap[player.id]
                    ? fmtLastRostered(lastRosteredMap[player.id])
                    : <span className="text-xs">—</span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(player)}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      {player.status === 'active' ? (
                        <DropdownMenuItem
                          onClick={() => startTransition(() => archivePlayer(player.id))}
                        >
                          <Archive className="mr-2 size-4" />
                          Archive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => startTransition(() => restorePlayer(player.id))}
                        >
                          <RotateCcw className="mr-2 size-4" />
                          Restore
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select value={String(pageSize)} onValueChange={v => setSize(Number(v))}>
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <span>
            {filtered.length === 0 ? '0 players' : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add Player Dialog */}
      <Dialog open={addOpen} onOpenChange={open => { setAddOpen(open); if (!open) setAddForm({ firstName: '', lastName: '', poolId: pools[0]?.id ?? '', levelId: '' }) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Player</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  value={addForm.firstName}
                  onChange={e => setAddForm(f => ({ ...f, firstName: e.target.value }))}
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  value={addForm.lastName}
                  onChange={e => setAddForm(f => ({ ...f, lastName: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Pool</FieldLabel>
                <Select value={addForm.poolId} onValueChange={v => setAddForm(f => ({ ...f, poolId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pool" />
                  </SelectTrigger>
                  <SelectContent>
                    {pools.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Level</FieldLabel>
                <Select value={addForm.levelId || '_none'} onValueChange={v => setAddForm(f => ({ ...f, levelId: v === '_none' ? '' : v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">— None —</SelectItem>
                    {playerLevels.map(l => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAdd}
              disabled={!addForm.firstName.trim() || !addForm.lastName.trim() || !addForm.poolId || isPending}
            >
              Add Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Player Dialog */}
      <Dialog open={!!editPlayer} onOpenChange={open => { if (!open) setEditPlayer(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  value={editForm.firstName}
                  onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  value={editForm.lastName}
                  onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') handleEdit() }}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Pool</FieldLabel>
                <Select value={editForm.poolId} onValueChange={v => setEditForm(f => ({ ...f, poolId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pool" />
                  </SelectTrigger>
                  <SelectContent>
                    {pools.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Level</FieldLabel>
                <Select value={editForm.levelId || '_none'} onValueChange={v => setEditForm(f => ({ ...f, levelId: v === '_none' ? '' : v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">— None —</SelectItem>
                    {playerLevels.map(l => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPlayer(null)}>Cancel</Button>
            <Button
              onClick={handleEdit}
              disabled={!editForm.firstName.trim() || !editForm.lastName.trim() || isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
