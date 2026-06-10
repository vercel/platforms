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
import { Plus, Pencil, Archive, ChevronDown, ChevronRight, Users, Upload, X, MapPin, Star, Check, Palette, ChevronUp, GripVertical } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import {
  updateAccountName,
  updateAccountAddress,
  updateBrandColors,
  uploadAccountLogo,
  removeAccountLogo,
  addCoach,
  removeCoach,
  addJerseyColor,
  removeJerseyColor,
  addLocation,
  removeLocation,
  addPool,
  updateCoachGameEditPermission,
  addPlayerLevel,
  removePlayerLevel,
  movePlayerLevel,
  updatePlayerLevelColor,
  addGameFormat,
  removeGameFormat,
  moveGameFormat,
  setPoolDefaultFormat,
} from './actions'

export type CoachRow = { id: string; name: string; email: string; memberId?: string; canEditGames: boolean }
export type PlayerLevelRow = { id: string; name: string; rank: number; color: string | null }
export type GameFormatRow = { id: string; name: string; rank: number }
export type TeamRow = { id: string; name: string; archived: boolean }
export type PoolRow = {
  id: string
  name: string
  lead: { id: string; name: string } | null
  assignedCoaches: { id: string; name: string }[]
  teams: TeamRow[]
  defaultGameFormatId: string | null
}
export type JerseyColorRow = { id: string; name: string; color: string }
export type LocationRow = { id: string; name: string; address: string | null; alternate_names: string[] }

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value) || /^#[0-9a-fA-F]{3}$/.test(value)
}

const levelColorPresets = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#14B8A6', '#3B82F6', '#6366F1', '#A855F7',
  '#EC4899', '#6B7280',
]

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

export type AccountRow = {
  id: string
  name: string
  address: string | null
  logo_url: string | null
  brand_color_primary: string | null
  brand_color_secondary: string | null
}

export function SettingsClient({
  account,
  coaches,
  pools,
  jerseyColors,
  locations,
  playerLevels,
  gameFormats,
}: {
  account: AccountRow
  coaches: CoachRow[]
  pools: PoolRow[]
  jerseyColors: JerseyColorRow[]
  locations: LocationRow[]
  playerLevels: PlayerLevelRow[]
  gameFormats: GameFormatRow[]
}) {
  const [isPending, startTransition] = useTransition()
  const [academyName, setAcademyName] = useState(account.name)
  const [academyAddress, setAcademyAddress] = useState(account.address ?? '')
  const [logoUrl, setLogoUrl] = useState<string | null>(account.logo_url)
  const [logoUploading, setLogoUploading] = useState(false)

  // Brand colors
  const [primaryColor, setPrimaryColor] = useState(account.brand_color_primary ?? '')
  const [secondaryColor, setSecondaryColor] = useState(account.brand_color_secondary ?? '')

  // UI state
  const [expandedPools, setExpandedPools] = useState<string[]>([])
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [customColorName, setCustomColorName] = useState('')
  const [customColorValue, setCustomColorValue] = useState('#000000')
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Player level add form
  const [newLevelName, setNewLevelName] = useState('')
  const [isAddingLevel, setIsAddingLevel] = useState(false)

  // Game format add form
  const [newFormatName, setNewFormatName] = useState('')
  const [isAddingFormat, setIsAddingFormat] = useState(false)

  function handleAddFormat() {
    if (!newFormatName.trim()) return
    startTransition(() => addGameFormat(newFormatName))
    setNewFormatName('')
    setIsAddingFormat(false)
  }

  function handleAddLevel() {
    if (!newLevelName.trim()) return
    startTransition(() => addPlayerLevel(newLevelName))
    setNewLevelName('')
    setIsAddingLevel(false)
  }

  // Coach add form
  const [isAddingCoach, setIsAddingCoach] = useState(false)
  const [newCoach, setNewCoach] = useState({ name: '', email: '' })

  function handleAddCoach() {
    if (!newCoach.name.trim() || !newCoach.email.trim()) return
    startTransition(() => addCoach(newCoach.name, newCoach.email))
    setNewCoach({ name: '', email: '' })
    setIsAddingCoach(false)
  }

  // Location add form
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [newLocation, setNewLocation] = useState({ name: '', address: '', alternateNames: '' })

  // Pool add form
  const [isAddingPool, setIsAddingPool] = useState(false)
  const [newPoolName, setNewPoolName] = useState('')
  const [newPoolLead, setNewPoolLead] = useState('')
  const [newPoolTeams, setNewPoolTeams] = useState<string[]>([])
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

  // Pool handlers
  function handleAddTeamToNewPool() {
    if (newTeamInput.trim()) {
      setNewPoolTeams([...newPoolTeams, newTeamInput.trim()])
      setNewTeamInput('')
    }
  }

  function handleAddPool() {
    if (!newPoolName.trim() || !newPoolLead) return
    startTransition(() => addPool(newPoolName, newPoolLead, newPoolTeams))
    setNewPoolName('')
    setNewPoolLead('')
    setNewPoolTeams([])
    setIsAddingPool(false)
  }

  function handleCancelAddPool() {
    setNewPoolName('')
    setNewPoolLead('')
    setNewPoolTeams([])
    setNewTeamInput('')
    setIsAddingPool(false)
  }

  function togglePool(id: string) {
    setExpandedPools(prev =>
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
          <TabsTrigger value="pools">Pools</TabsTrigger>
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
                {/* Logo */}
                <div className="flex flex-col items-center gap-3">
                  <FieldLabel>Academy Logo</FieldLabel>
                  <div className="relative">
                    <Avatar className="size-24">
                      <AvatarImage src={logoUrl || undefined} alt="Academy logo" />
                      <AvatarFallback className="bg-muted text-2xl font-bold">
                        {account.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {logoUrl && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 size-6"
                        disabled={isPending}
                        onClick={() => startTransition(async () => {
                          await removeAccountLogo(account.id)
                          setLogoUrl(null)
                        })}
                      >
                        <X className="size-3" />
                      </Button>
                    )}
                  </div>
                  <label htmlFor="logo-upload">
                    <Button variant="outline" size="sm" asChild disabled={logoUploading}>
                      <span>
                        <Upload className="mr-2 size-4" />
                        {logoUploading ? 'Uploading…' : 'Upload Logo'}
                      </span>
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={async e => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setLogoUrl(URL.createObjectURL(file))
                        setLogoUploading(true)
                        try {
                          const fd = new FormData()
                          fd.append('logo', file)
                          const url = await uploadAccountLogo(fd)
                          setLogoUrl(url)
                        } finally {
                          setLogoUploading(false)
                          e.target.value = ''
                        }
                      }}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">Max 2 MB</p>
                </div>

                {/* Name + Address */}
                <div className="flex-1">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Academy Name</FieldLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter academy name"
                          value={academyName}
                          onChange={e => setAcademyName(e.target.value)}
                        />
                        <Button
                          size="sm"
                          disabled={isPending || !academyName.trim() || academyName === account.name}
                          onClick={() => startTransition(() => updateAccountName(account.id, academyName))}
                        >
                          Save
                        </Button>
                      </div>
                    </Field>
                    <Field>
                      <FieldLabel>Home Field Address</FieldLabel>
                      <div className="flex flex-col gap-2">
                        <Textarea
                          placeholder="Enter the full address of your home field"
                          value={academyAddress}
                          onChange={e => setAcademyAddress(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            disabled={isPending || academyAddress === (account.address ?? '')}
                            onClick={() => startTransition(() => updateAccountAddress(account.id, academyAddress))}
                          >
                            Save Address
                          </Button>
                        </div>
                      </div>
                    </Field>
                  </FieldGroup>
                </div>
              </div>

              {/* Brand colors */}
              <div className="border-t pt-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium">Brand Colors</h3>
                  <p className="text-sm text-muted-foreground">Primary and secondary colors for your academy</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-sm font-medium">Primary</span>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="color"
                        value={isValidHex(primaryColor) ? primaryColor : '#000000'}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="size-9 cursor-pointer rounded border p-0.5"
                        title="Pick a color"
                      />
                      <Input
                        className="w-44 font-mono text-sm"
                        placeholder="#000000 or rgb(0,0,0)"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        spellCheck={false}
                      />
                      {primaryColor && (
                        <span
                          className="inline-block size-6 rounded-full border"
                          style={{ backgroundColor: primaryColor }}
                          title="Preview"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-sm font-medium">Secondary</span>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="color"
                        value={isValidHex(secondaryColor) ? secondaryColor : '#000000'}
                        onChange={e => setSecondaryColor(e.target.value)}
                        className="size-9 cursor-pointer rounded border p-0.5"
                        title="Pick a color"
                      />
                      <Input
                        className="w-44 font-mono text-sm"
                        placeholder="#000000 or rgb(0,0,0)"
                        value={secondaryColor}
                        onChange={e => setSecondaryColor(e.target.value)}
                        spellCheck={false}
                      />
                      {secondaryColor && (
                        <span
                          className="inline-block size-6 rounded-full border"
                          style={{ backgroundColor: secondaryColor }}
                          title="Preview"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      disabled={
                        isPending ||
                        (primaryColor === (account.brand_color_primary ?? '') &&
                          secondaryColor === (account.brand_color_secondary ?? ''))
                      }
                      onClick={() => startTransition(() =>
                        updateBrandColors(account.id, primaryColor || null, secondaryColor || null)
                      )}
                    >
                      Save Colors
                    </Button>
                  </div>
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

              {/* Player Levels */}
              <div className="border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Player Levels</h3>
                    <p className="text-sm text-muted-foreground">Ability levels ranked from best to lowest</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingLevel(true)}
                    disabled={isAddingLevel}
                  >
                    <Plus className="mr-2 size-4" />
                    Add Level
                  </Button>
                </div>

                {isAddingLevel && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                    <Input
                      placeholder="Level name (e.g. Elite, Advanced)"
                      value={newLevelName}
                      onChange={e => setNewLevelName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddLevel() }}
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleAddLevel} disabled={!newLevelName.trim() || isPending}>
                      Add
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setIsAddingLevel(false); setNewLevelName('') }}>
                      Cancel
                    </Button>
                  </div>
                )}

                {playerLevels.length === 0 && !isAddingLevel ? (
                  <p className="rounded-md border border-dashed py-4 text-center text-sm text-muted-foreground">
                    No levels defined yet. Click &quot;Add Level&quot; to get started.
                  </p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {playerLevels.map((level, idx) => (
                      <div
                        key={level.id}
                        className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2"
                      >
                        <GripVertical className="size-4 text-muted-foreground shrink-0" />
                        {/* Color swatch */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="size-5 rounded-full border-2 border-muted shrink-0 hover:scale-110 transition-transform"
                              style={{ backgroundColor: level.color ?? '#e5e7eb' }}
                              title="Change color"
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-52 p-3" align="start">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">Tag color</p>
                            <div className="grid grid-cols-5 gap-2">
                              {levelColorPresets.map(hex => (
                                <button
                                  key={hex}
                                  className="size-8 rounded-full border-2 transition-all hover:scale-110"
                                  style={{
                                    backgroundColor: hex,
                                    borderColor: level.color === hex ? hex : 'transparent',
                                    outline: level.color === hex ? `2px solid ${hex}` : undefined,
                                    outlineOffset: level.color === hex ? '2px' : undefined,
                                  }}
                                  disabled={isPending}
                                  onClick={() => startTransition(() => updatePlayerLevelColor(level.id, hex))}
                                />
                              ))}
                            </div>
                            {level.color && (
                              <button
                                className="mt-2 w-full rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                                onClick={() => startTransition(() => updatePlayerLevelColor(level.id, null))}
                              >
                                Remove color
                              </button>
                            )}
                          </PopoverContent>
                        </Popover>
                        <span className="flex-1 text-sm font-medium">{level.name}</span>
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            disabled={idx === 0 || isPending}
                            onClick={() => startTransition(() => movePlayerLevel(level.id, 'up'))}
                          >
                            <ChevronUp className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            disabled={idx === playerLevels.length - 1 || isPending}
                            onClick={() => startTransition(() => movePlayerLevel(level.id, 'down'))}
                          >
                            <ChevronDown className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 hover:text-destructive"
                            disabled={isPending}
                            onClick={() => startTransition(() => removePlayerLevel(level.id))}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Game Formats */}
              <div className="border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Game Formats</h3>
                    <p className="text-sm text-muted-foreground">Formats used in games (e.g. 7v7, 9v9)</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingFormat(true)}
                    disabled={isAddingFormat}
                  >
                    <Plus className="mr-2 size-4" />
                    Add Format
                  </Button>
                </div>

                {isAddingFormat && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                    <Input
                      placeholder="Format name (e.g. 7v7, 9v9, 11v11)"
                      value={newFormatName}
                      onChange={e => setNewFormatName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddFormat() }}
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleAddFormat} disabled={!newFormatName.trim() || isPending}>
                      Add
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setIsAddingFormat(false); setNewFormatName('') }}>
                      Cancel
                    </Button>
                  </div>
                )}

                {gameFormats.length === 0 && !isAddingFormat ? (
                  <p className="rounded-md border border-dashed py-4 text-center text-sm text-muted-foreground">
                    No formats defined yet. Click &quot;Add Format&quot; to get started.
                  </p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {gameFormats.map((fmt, idx) => (
                      <div
                        key={fmt.id}
                        className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2"
                      >
                        <GripVertical className="size-4 text-muted-foreground shrink-0" />
                        <span className="flex-1 text-sm font-medium">{fmt.name}</span>
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            disabled={idx === 0 || isPending}
                            onClick={() => startTransition(() => moveGameFormat(fmt.id, 'up'))}
                          >
                            <ChevronUp className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            disabled={idx === gameFormats.length - 1 || isPending}
                            onClick={() => startTransition(() => moveGameFormat(fmt.id, 'down'))}
                          >
                            <ChevronDown className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 hover:text-destructive"
                            disabled={isPending}
                            onClick={() => startTransition(() => removeGameFormat(fmt.id))}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              <Button size="sm" onClick={() => setIsAddingCoach(true)} disabled={isAddingCoach}>
                <Plus className="mr-2 h-4 w-4" />
                Add Coach
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {isAddingCoach && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <h4 className="mb-4 text-sm font-medium">New Coach</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Name</FieldLabel>
                      <Input
                        placeholder="Coach name"
                        value={newCoach.name}
                        onChange={e => setNewCoach({ ...newCoach, name: e.target.value })}
                        autoFocus
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        type="email"
                        placeholder="coach@example.com"
                        value={newCoach.email}
                        onChange={e => setNewCoach({ ...newCoach, email: e.target.value })}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddCoach() }}
                      />
                    </Field>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setIsAddingCoach(false); setNewCoach({ name: '', email: '' }) }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddCoach}
                      disabled={!newCoach.name.trim() || !newCoach.email.trim() || isPending}
                    >
                      Add Coach
                    </Button>
                  </div>
                </div>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Pools</TableHead>
                      <TableHead className="w-28">Edit Games</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coaches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                          No coaches added yet. Click &quot;Add Coach&quot; to get started.
                        </TableCell>
                      </TableRow>
                    ) : coaches.map(coach => {
                      const coachPools = pools.filter(g =>
                        g.assignedCoaches.some(c => c.id === coach.id)
                      )
                      return (
                        <TableRow key={coach.id}>
                          <TableCell className="font-medium">{coach.name}</TableCell>
                          <TableCell className="text-muted-foreground">{coach.email}</TableCell>
                          <TableCell>
                            {coachPools.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {coachPools.map(g => {
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
                              <span className="text-sm text-muted-foreground">No pools assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {coach.memberId ? (
                              <Switch
                                checked={coach.canEditGames}
                                disabled={isPending}
                                onCheckedChange={checked =>
                                  startTransition(() =>
                                    updateCoachGameEditPermission(coach.memberId!, checked)
                                  )
                                }
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">No login</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startTransition(() => removeCoach(coach.id))}
                              disabled={isPending}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
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

        {/* ── POOLS ── */}
        <TabsContent value="pools" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pools</CardTitle>
                <CardDescription>Manage pools and their teams</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsAddingPool(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Pool
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {isAddingPool && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h4 className="mb-4 text-sm font-medium">New Pool</h4>
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                          <FieldLabel>Pool Name</FieldLabel>
                          <Input
                            placeholder="e.g. U10, Varsity, Development"
                            value={newPoolName}
                            onChange={e => setNewPoolName(e.target.value)}
                            autoFocus
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Pool Lead</FieldLabel>
                          <Select value={newPoolLead} onValueChange={setNewPoolLead}>
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
                        {newPoolTeams.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {newPoolTeams.map((team, i) => (
                              <Badge key={i} variant="secondary" className="py-1 pl-2 pr-1">
                                {team}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-1 size-4 hover:bg-destructive/20"
                                  onClick={() =>
                                    setNewPoolTeams(newPoolTeams.filter((_, j) => j !== i))
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
                                handleAddTeamToNewPool()
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddTeamToNewPool}
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
                        <Button variant="outline" size="sm" onClick={handleCancelAddPool}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleAddPool}
                          disabled={!newPoolName.trim() || !newPoolLead || isPending}
                        >
                          Create Pool
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {pools.map(pool => (
                  <Collapsible
                    key={pool.id}
                    open={expandedPools.includes(pool.id)}
                    onOpenChange={() => togglePool(pool.id)}
                  >
                    <div className="rounded-lg border">
                      <CollapsibleTrigger asChild>
                        <div className="flex cursor-pointer items-center justify-between p-4 hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            {expandedPools.includes(pool.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{pool.name}</span>
                                <Badge variant="outline">{pool.teams.length} teams</Badge>
                                <Badge variant="secondary">
                                  <Users className="mr-1 h-3 w-3" />
                                  {pool.assignedCoaches.length} coaches
                                </Badge>
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                {pool.lead && (
                                  <>
                                    <span className="font-medium">Lead:</span> {pool.lead.name}
                                    <span className="mx-2">|</span>
                                  </>
                                )}
                                <span className="font-medium">Coaches:</span>{' '}
                                {pool.assignedCoaches.map(c => c.name).join(', ')}
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
                          {gameFormats.length > 0 && (
                            <div className="mb-4 flex items-center gap-3">
                              <span className="text-sm font-medium w-36 shrink-0">Default Game Format</span>
                              <Select
                                value={pool.defaultGameFormatId ?? '_none'}
                                onValueChange={v =>
                                  startTransition(() =>
                                    setPoolDefaultFormat(pool.id, v === '_none' ? null : v)
                                  )
                                }
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="_none">— None —</SelectItem>
                                  {gameFormats.map(fmt => (
                                    <SelectItem key={fmt.id} value={fmt.id}>{fmt.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
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
                                {pool.teams
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
