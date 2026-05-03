'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Plus, Pencil, Archive, ChevronDown, ChevronRight, Users, Upload, X, MapPin, Star, Check, Palette } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  addJerseyColor,
  removeJerseyColor,
  addLocation,
  removeLocation,
  addGroup,
} from './actions'

export type CoachRow = { id: string; name: string; email: string }
export type TeamRow = { id: string; name: string; archived: boolean }
export type GroupRow = {
  id: string
  name: string
  lead: { id: string; name: string } | null
  assignedCoaches: { id: string; name: string }[]
  teams: TeamRow[]
}
export type JerseyColorRow = { id: string; name: string; color: string }
export type LocationRow = { id: string; name: string; address: string | null; alternate_names: string[] }

const colorPresets = [
  { name: 'White',  color: '#FFFFFF' },
  { name: 'Black',  color: '#000000' },
  { name: 'Red',    color: '#DC2626' },
  { name: 'Blue',   color: '#2563EB' },
  { name: 'Navy',   color: '#1E3A5F' },
  { name: 'Green',  color: '#16A34A' },
  { name: 'Yellow', color: '#EAB308' },
  { name: 'Orange', color: '#EA580C' },
  { name: 'Purple', color: '#7C3AED' },
  { name: 'Pink',   color: '#EC4899' },
  { name: 'Gray',   color: '#6B7280' },
  { name: 'Gold',   color: '#CA8A04' },
]

export function SettingsClient({
  coaches,
  groups,
  jerseyColors,
  locations,
}: {
  coaches: CoachRow[]
  groups: GroupRow[]
  jerseyColors: JerseyColorRow[]
  locations: LocationRow[]
}) {
  const [isPending, startTransition] = useTransition()

  // UI state
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [customColorName, setCustomColorName] = useState('')
  const [customColorValue, setCustomColorValue] = useState('#000000')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  // Location add form
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [newLocation, setNewLocation] = useState({ name: '', address: '', alternateNames: '' })

  // Group add form
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupLead, setNewGroupLead] = useState('')
  const [newGroupTeams, setNewGroupTeams] = useState<string[]>([])
  const [newTeamInput, setNewTeamInput] = useState('')

  // Jersey color handlers
  function handleAddPreset(preset: { name: string; color: string }) {
    if (jerseyColors.some(c => c.name.toLowerCase() === preset.name.toLowerCase())) return
    startTransition(() => addJerseyColor(preset.name, preset.color))
    setIsColorPickerOpen(false)
  }

  function handleAddCustomColor() {
    if (!customColorName.trim()) return
    startTransition(() => addJerseyColor(customColorName.trim(), customColorValue))
    setCustomColorName('')
    setCustomColorValue('#000000')
    setShowCustomInput(false)
    setIsColorPickerOpen(false)
  }

  function handleRemoveColor(id: string) {
    startTransition(() => removeJerseyColor(id))
  }

  // Location handlers
  function handleAddLocation() {
    if (!newLocation.name.trim()) return
    const altNames = newLocation.alternateNames
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0)
    startTransition(() => addLocation(newLocation.name, newLocation.address, altNames))
    setNewLocation({ name: '', address: '', alternateNames: '' })
    setIsAddingLocation(false)
  }

  function handleRemoveLocation(id: string) {
    startTransition(() => removeLocation(id))
  }

  // Group handlers
  function handleAddTeamToNewGroup() {
    if (newTeamInput.trim()) {
      setNewGroupTeams([...newGroupTeams, newTeamInput.trim()])
      setNewTeamInput('')
    }
  }

  function handleAddGroup() {
    if (!newGroupName.trim() || !newGroupLead) return
    startTransition(() => addGroup(newGroupName, newGroupLead, newGroupTeams))
    setNewGroupName('')
    setNewGroupLead('')
    setNewGroupTeams([])
    setIsAddingGroup(false)
  }

  function handleCancelAddGroup() {
    setNewGroupName('')
    setNewGroupLead('')
    setNewGroupTeams([])
    setNewTeamInput('')
    setIsAddingGroup(false)
  }

  function toggleGroup(id: string) {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academy Settings</h1>
        <p className="text-muted-foreground">Manage your academy configuration</p>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Academy Details</TabsTrigger>
          <TabsTrigger value="coaches">Coaches</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* ── DETAILS ── */}
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Academy Details</CardTitle>
              <CardDescription>Basic information about your academy</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <div className="flex flex-col items-center gap-3">
                  <FieldLabel>Academy Logo</FieldLabel>
                  <div className="relative">
                    <Avatar className="size-24">
                      <AvatarImage src={logoUrl || undefined} alt="Academy logo" />
                      <AvatarFallback className="bg-muted text-2xl">ESA</AvatarFallback>
                    </Avatar>
                    {logoUrl && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 size-6"
                        onClick={() => setLogoUrl(null)}
                      >
                        <X className="size-3" />
                      </Button>
                    )}
                  </div>
                  <label htmlFor="logo-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="mr-2 size-4" />
                        Upload Logo
                      </span>
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) setLogoUrl(URL.createObjectURL(file))
                      }}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Academy Name</FieldLabel>
                      <Input placeholder="Enter academy name" defaultValue="Elite Soccer Academy" />
                    </Field>
                    <Field>
                      <FieldLabel>Home Field Address</FieldLabel>
                      <Textarea
                        placeholder="Enter the full address of your home field"
                        defaultValue={'123 Sports Complex Drive\nSpringfield, IL 62701'}
                        rows={3}
                      />
                    </Field>
                  </FieldGroup>
                </div>
              </div>

              {/* Jersey colors */}
              <div className="border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Jersey Colors</h3>
                    <p className="text-sm text-muted-foreground">Colors available for game assignments</p>
                  </div>
                  <Popover
                    open={isColorPickerOpen}
                    onOpenChange={open => {
                      setIsColorPickerOpen(open)
                      if (!open) {
                        setShowCustomInput(false)
                        setCustomColorName('')
                        setCustomColorValue('#000000')
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 size-4" />
                        Add Color
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3" align="end">
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium">Select a color</p>
                        <div className="grid grid-cols-6 gap-2">
                          {colorPresets.map(preset => {
                            const isAdded = jerseyColors.some(
                              c => c.name.toLowerCase() === preset.name.toLowerCase()
                            )
                            return (
                              <button
                                key={preset.name}
                                onClick={() => !isAdded && handleAddPreset(preset)}
                                disabled={isAdded || isPending}
                                className="group relative flex flex-col items-center gap-1"
                                title={preset.name}
                              >
                                <span
                                  className={`size-8 rounded-full border-2 transition-all ${isAdded ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:scale-110 hover:shadow-md'} ${preset.color === '#FFFFFF' ? 'border-gray-300' : 'border-transparent'}`}
                                  style={{ backgroundColor: preset.color }}
                                >
                                  {isAdded && (
                                    <Check className="absolute inset-0 m-auto size-4 text-white drop-shadow-md" />
                                  )}
                                </span>
                                <span className="max-w-[40px] truncate text-[10px] text-muted-foreground">
                                  {preset.name}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                        <div className="border-t pt-3">
                          {!showCustomInput ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => setShowCustomInput(true)}
                            >
                              <Palette className="mr-2 size-4" />
                              Custom color...
                            </Button>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={customColorValue}
                                  onChange={e => setCustomColorValue(e.target.value)}
                                  className="size-8 cursor-pointer rounded border p-0.5"
                                />
                                <Input
                                  placeholder="Color name"
                                  value={customColorName}
                                  onChange={e => setCustomColorName(e.target.value)}
                                  className="h-8 flex-1"
                                  autoFocus
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' && customColorName.trim())
                                      handleAddCustomColor()
                                  }}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => {
                                    setShowCustomInput(false)
                                    setCustomColorName('')
                                    setCustomColorValue('#000000')
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1"
                                  onClick={handleAddCustomColor}
                                  disabled={!customColorName.trim() || isPending}
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {jerseyColors.length === 0 ? (
                  <p className="rounded-md border border-dashed py-4 text-center text-sm text-muted-foreground">
                    No jersey colors added yet. Click &quot;Add Color&quot; to get started.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {jerseyColors.map(jersey => (
                      <div
                        key={jersey.id}
                        className="group flex items-center gap-2 rounded-full border bg-background py-1 pl-1 pr-2 transition-colors hover:bg-muted"
                      >
                        <span
                          className={`size-6 rounded-full border ${jersey.color.toUpperCase() === '#FFFFFF' ? 'border-gray-300' : 'border-transparent'}`}
                          style={{ backgroundColor: jersey.color }}
                        />
                        <span className="text-sm font-medium">{jersey.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-5 opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100"
                          onClick={() => handleRemoveColor(jersey.id)}
                          disabled={isPending}
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── COACHES ── */}
        <TabsContent value="coaches" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Coaches</CardTitle>
                <CardDescription>Manage coaching staff for your academy</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Coach
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Groups</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coaches.map(coach => {
                      const coachGroups = groups.filter(g =>
                        g.assignedCoaches.some(c => c.id === coach.id)
                      )
                      return (
                        <TableRow key={coach.id}>
                          <TableCell className="font-medium">{coach.name}</TableCell>
                          <TableCell>{coach.email}</TableCell>
                          <TableCell>
                            {coachGroups.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {coachGroups.map(g => {
                                  const isLead = g.lead?.id === coach.id
                                  return (
                                    <Badge
                                      key={g.id}
                                      variant={isLead ? 'default' : 'secondary'}
                                      className="flex items-center gap-1"
                                    >
                                      {isLead && <Star className="size-3 fill-current" />}
                                      {g.name}
                                    </Badge>
                                  )
                                })}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">No groups assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Archive className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── GROUPS ── */}
        <TabsContent value="groups" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Groups</CardTitle>
                <CardDescription>Manage groups and their teams</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsAddingGroup(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Group
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {isAddingGroup && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h4 className="mb-4 text-sm font-medium">New Group</h4>
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                          <FieldLabel>Group Name</FieldLabel>
                          <Input
                            placeholder="e.g. U10, Varsity, Development"
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                            autoFocus
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Group Lead</FieldLabel>
                          <Select value={newGroupLead} onValueChange={setNewGroupLead}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a coach" />
                            </SelectTrigger>
                            <SelectContent>
                              {coaches.map(coach => (
                                <SelectItem key={coach.id} value={coach.id}>
                                  {coach.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </div>

                      <div>
                        <FieldLabel className="mb-2">Teams</FieldLabel>
                        {newGroupTeams.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {newGroupTeams.map((team, i) => (
                              <Badge key={i} variant="secondary" className="py-1 pl-2 pr-1">
                                {team}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-1 size-4 hover:bg-destructive/20"
                                  onClick={() =>
                                    setNewGroupTeams(newGroupTeams.filter((_, j) => j !== i))
                                  }
                                >
                                  <X className="size-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter team name and press Enter"
                            value={newTeamInput}
                            onChange={e => setNewTeamInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddTeamToNewGroup()
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddTeamToNewGroup}
                            disabled={!newTeamInput.trim()}
                          >
                            <Plus className="mr-1 size-4" />
                            Add
                          </Button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Press Enter to quickly add teams
                        </p>
                      </div>

                      <div className="flex justify-end gap-2 border-t pt-2">
                        <Button variant="outline" size="sm" onClick={handleCancelAddGroup}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleAddGroup}
                          disabled={!newGroupName.trim() || !newGroupLead || isPending}
                        >
                          Create Group
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {groups.map(group => (
                  <Collapsible
                    key={group.id}
                    open={expandedGroups.includes(group.id)}
                    onOpenChange={() => toggleGroup(group.id)}
                  >
                    <div className="rounded-lg border">
                      <CollapsibleTrigger asChild>
                        <div className="flex cursor-pointer items-center justify-between p-4 hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            {expandedGroups.includes(group.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{group.name}</span>
                                <Badge variant="outline">{group.teams.length} teams</Badge>
                                <Badge variant="secondary">
                                  <Users className="mr-1 h-3 w-3" />
                                  {group.assignedCoaches.length} coaches
                                </Badge>
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                {group.lead && (
                                  <>
                                    <span className="font-medium">Lead:</span> {group.lead.name}
                                    <span className="mx-2">|</span>
                                  </>
                                )}
                                <span className="font-medium">Coaches:</span>{' '}
                                {group.assignedCoaches.map(c => c.name).join(', ')}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border-t bg-muted/30 p-4">
                          <h4 className="mb-3 text-sm font-medium">Teams</h4>
                          <div className="rounded-md border bg-background">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Team Name</TableHead>
                                  <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {group.teams
                                  .filter(t => !t.archived)
                                  .map(team => (
                                    <TableRow key={team.id}>
                                      <TableCell className="font-medium">{team.name}</TableCell>
                                      <TableCell>
                                        <div className="flex gap-1">
                                          <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon">
                                            <Archive className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                <TableRow>
                                  <TableCell colSpan={2}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start text-muted-foreground"
                                    >
                                      <Plus className="mr-2 size-4" />
                                      Add team
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── LOCATIONS ── */}
        <TabsContent value="locations" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Locations</CardTitle>
                <CardDescription>Manage facilities and venues for games and practices</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsAddingLocation(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {isAddingLocation && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h4 className="mb-4 text-sm font-medium">New Location</h4>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Location Name</FieldLabel>
                        <Input
                          placeholder="e.g. Central Park Arena"
                          value={newLocation.name}
                          onChange={e => setNewLocation({ ...newLocation, name: e.target.value })}
                          autoFocus
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Address</FieldLabel>
                        <Textarea
                          placeholder="Enter the full address"
                          value={newLocation.address}
                          onChange={e => setNewLocation({ ...newLocation, address: e.target.value })}
                          rows={2}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Alternate Names</FieldLabel>
                        <Input
                          placeholder="e.g. CPA, Main Field (comma separated)"
                          value={newLocation.alternateNames}
                          onChange={e =>
                            setNewLocation({ ...newLocation, alternateNames: e.target.value })
                          }
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Enter comma-separated alternate names or abbreviations
                        </p>
                      </Field>
                    </FieldGroup>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" onClick={handleAddLocation} disabled={isPending}>
                        Add Location
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsAddingLocation(false)
                          setNewLocation({ name: '', address: '', alternateNames: '' })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Alternate Names</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locations.map(loc => (
                        <TableRow key={loc.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="size-4 text-muted-foreground" />
                              <span className="font-medium">{loc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-pre-line text-muted-foreground">
                            {loc.address}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {loc.alternate_names.map((alt, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {alt}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveLocation(loc.id)}
                                disabled={isPending}
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
