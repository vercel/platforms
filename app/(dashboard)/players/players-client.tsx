'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Plus, MoreHorizontal, Archive, RotateCcw, Users } from 'lucide-react'
import { addPlayer, archivePlayer, restorePlayer } from './actions'

export type PlayerRow = {
  id: string
  first_name: string
  last_name: string
  group_id: string
  status: 'active' | 'archived'
  groups: { name: string } | null
}

export type GroupRow = {
  id: string
  name: string
}

function formatName(player: PlayerRow) {
  return `${player.first_name} ${player.last_name.charAt(0)}.`
}

export function PlayersClient({
  players,
  groups,
}: {
  players: PlayerRow[]
  groups: GroupRow[]
}) {
  const [showArchived, setShowArchived] = useState(false)
  const [addingToGroup, setAddingToGroup] = useState<string | null>(null)
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = players.filter(p =>
    showArchived ? p.status === 'archived' : p.status === 'active'
  )

  const byGroup = (groupId: string) => filtered.filter(p => p.group_id === groupId)

  const groupsWithArchived = groups.filter(g => byGroup(g.id).length > 0)

  const activeCount = players.filter(p => p.status === 'active').length
  const archivedCount = players.filter(p => p.status === 'archived').length

  function handleAdd(groupId: string) {
    if (!newFirstName.trim() || !newLastName.trim()) return
    startTransition(async () => {
      await addPlayer(groupId, newFirstName, newLastName)
      setNewFirstName('')
      setNewLastName('')
      setAddingToGroup(null)
    })
  }

  function handleCancel() {
    setNewFirstName('')
    setNewLastName('')
    setAddingToGroup(null)
  }

  function handleKeyDown(e: React.KeyboardEvent, groupId: string) {
    if (e.key === 'Enter' && newFirstName.trim() && newLastName.trim()) handleAdd(groupId)
    else if (e.key === 'Escape') handleCancel()
  }

  function renderTable(groupPlayers: PlayerRow[], group: GroupRow) {
    const isAdding = addingToGroup === group.id

    return (
      <div key={group.id} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <Badge variant="secondary">{groupPlayers.length}</Badge>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupPlayers.map(player => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{formatName(player)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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

              {!showArchived && (
                isAdding ? (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="First name"
                          value={newFirstName}
                          onChange={e => setNewFirstName(e.target.value)}
                          onKeyDown={e => handleKeyDown(e, group.id)}
                          className="h-8 w-32"
                          autoFocus
                          disabled={isPending}
                        />
                        <Input
                          placeholder="Last name"
                          value={newLastName}
                          onChange={e => setNewLastName(e.target.value)}
                          onKeyDown={e => handleKeyDown(e, group.id)}
                          className="h-8 w-32"
                          disabled={isPending}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAdd(group.id)}
                          disabled={!newFirstName.trim() || !newLastName.trim() || isPending}
                        >
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isPending}>
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-muted-foreground"
                        onClick={() => setAddingToGroup(group.id)}
                      >
                        <Plus className="mr-2 size-4" />
                        Add player
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground">
            {showArchived
              ? `${archivedCount} archived player${archivedCount !== 1 ? 's' : ''}`
              : `${activeCount} active player${activeCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button
          variant={showArchived ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowArchived(!showArchived)}
        >
          <Archive className="mr-2 size-4" />
          {showArchived ? 'Show Active' : 'Show Archived'}
        </Button>
      </div>

      {showArchived ? (
        groupsWithArchived.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Users className="size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No archived players</h3>
            <p className="mt-2 text-sm text-muted-foreground">No archived players to display.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groupsWithArchived.map(g => renderTable(byGroup(g.id), g))}
          </div>
        )
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map(g => renderTable(byGroup(g.id), g))}
        </div>
      )}
    </div>
  )
}
