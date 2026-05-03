"use client"

import { useState, useMemo, useTransition } from "react"
import * as XLSX from "xlsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Play,
  Upload,
  FileSpreadsheet,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createGameDay } from "@/app/(dashboard)/game-day/actions"
import { useRouter } from "next/navigation"

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = "details" | "upload" | "mapping" | "preview"

interface ColMap {
  group: string
  date: string
  time: string
  team1: string
  team2: string
  facility: string
  field: string
}

interface ParsedFile {
  headers: string[]
  rows: string[][]
  fileName: string
}

interface MappedRow {
  idx: number
  group: string
  date: string
  time: string
  team1: string
  team2: string
  facility: string
  field: string
}

interface TeamRes {
  action: "existing" | "new"
  teamId?: string
  teamName: string
}

interface LocRes {
  action: "existing" | "new"
  locationId?: string
  name: string
  address: string
}

export interface WizardGroup {
  id: string
  name: string
  leadCoachId: string | null
  teams: Array<{ id: string; name: string }>
}

interface Props {
  groups: WizardGroup[]
  coaches: Array<{ id: string; name: string }>
  locations: Array<{ id: string; name: string; address: string | null }>
  accountId: string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")

function bestMatch<T>(raw: string, items: T[], key: (item: T) => string): T | null {
  const n = norm(raw)
  if (!n) return null
  return (
    items.find(i => norm(key(i)) === n) ??
    items.find(i => norm(key(i)).includes(n) || n.includes(norm(key(i)))) ??
    null
  )
}

function parseDate(raw: string): string | null {
  if (!raw?.trim()) return null
  const s = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2, "0")}-${mdy[2].padStart(2, "0")}`
  const parsed = new Date(s)
  if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
  return null
}

function parseTime(raw: string): string | null {
  if (!raw?.trim()) return null
  const s = raw.trim()
  const hm = s.match(/^(\d{1,2}):(\d{2})$/)
  if (hm) return `${hm[1].padStart(2, "0")}:${hm[2]}:00`
  const hmap = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (hmap) {
    let h = parseInt(hmap[1])
    const pm = hmap[3].toUpperCase() === "PM"
    if (pm && h !== 12) h += 12
    if (!pm && h === 12) h = 0
    return `${h.toString().padStart(2, "0")}:${hmap[2]}:00`
  }
  return null
}

const REQUIRED_FIELDS = [
  { key: "group" as const, label: "Group" },
  { key: "team1" as const, label: "Home Team" },
  { key: "team2" as const, label: "Away Team" },
]

const OPTIONAL_FIELDS = [
  { key: "date" as const, label: "Date" },
  { key: "time" as const, label: "Time" },
  { key: "facility" as const, label: "Facility / Location" },
  { key: "field" as const, label: "Field" },
]

const BLANK_COL_MAP: ColMap = { group: "", date: "", time: "", team1: "", team2: "", facility: "", field: "" }
const TEAM_NEW = "__new__"
const LOC_NEW = "__new__"

// ─── Component ───────────────────────────────────────────────────────────────

export function NewGameDayWizard({ groups, coaches, locations, accountId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("details")

  // Step 1
  const [name, setName] = useState("")

  // Step 2
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Step 3
  const [colMap, setColMap] = useState<ColMap>(BLANK_COL_MAP)

  // Step 4 resolution state
  const [groupRes, setGroupRes] = useState<Record<string, string | null>>({})
  const [teamRes, setTeamRes] = useState<Record<string, TeamRes>>({})
  const [locRes, setLocRes] = useState<Record<string, LocRes>>({})
  const [rosters, setRosters] = useState<Record<number, { home: boolean; away: boolean }>>({})
  const [groupLeads, setGroupLeads] = useState<Record<string, string>>({})

  const resetWizard = () => {
    setStep("details")
    setName("")
    setParsedFile(null)
    setColMap(BLANK_COL_MAP)
    setGroupRes({})
    setTeamRes({})
    setLocRes({})
    setRosters({})
    setGroupLeads({})
  }

  const handleOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v) resetWizard()
  }

  // ── File parsing ──────────────────────────────────────────────────────────

  const autoMap = (headers: string[]) => {
    const m: ColMap = { ...BLANK_COL_MAP }
    headers.forEach(h => {
      const l = h.toLowerCase()
      if (!m.group && (l.includes("group") || l.includes("age") || l.includes("division"))) m.group = h
      else if (!m.date && l.includes("date")) m.date = h
      else if (!m.time && (l.includes("time") || l.includes("start"))) m.time = h
      else if (!m.team1 && (l.includes("home") || l.includes("team 1") || l.includes("team1"))) m.team1 = h
      else if (!m.team2 && (l.includes("away") || l.includes("visitor") || l.includes("team 2") || l.includes("team2"))) m.team2 = h
      else if (!m.facility && (l.includes("facility") || l.includes("location") || l.includes("venue"))) m.facility = h
      else if (!m.field && (l.includes("field") || l.includes("court") || l.includes("pitch"))) m.field = h
    })
    setColMap(m)
  }

  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.trim().split(/\r?\n/)
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""))
    const rows = lines.slice(1).map(line => {
      const values: string[] = []
      let cur = ""
      let inQ = false
      for (const ch of line) {
        if (ch === '"') { inQ = !inQ }
        else if (ch === "," && !inQ) { values.push(cur.trim()); cur = "" }
        else { cur += ch }
      }
      values.push(cur.trim())
      return values
    }).filter(r => r.some(v => v))
    return { headers, rows }
  }

  const processFile = (file: File) => {
    if (file.name.endsWith(".csv")) {
      const reader = new FileReader()
      reader.onload = e => {
        const { headers, rows } = parseCSV(e.target?.result as string)
        setParsedFile({ headers, rows, fileName: file.name })
        autoMap(headers)
        setStep("mapping")
      }
      reader.readAsText(file)
    } else {
      const reader = new FileReader()
      reader.onload = e => {
        const wb = XLSX.read(e.target?.result as ArrayBuffer, { type: "array" })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: "" })
        const headers = (data[0] as unknown[]).map(h => String(h).trim()).filter(Boolean)
        const rows = (data.slice(1) as unknown[][])
          .map(row => headers.map((_, i) => String((row as unknown[])[i] ?? "").trim()))
          .filter(r => r.some(v => v))
        setParsedFile({ headers, rows, fileName: file.name })
        autoMap(headers)
        setStep("mapping")
      }
      reader.readAsArrayBuffer(file)
    }
  }

  // ── Mapped rows ───────────────────────────────────────────────────────────

  const mappedRows = useMemo((): MappedRow[] => {
    if (!parsedFile) return []
    return parsedFile.rows.map((row, idx) => {
      const get = (key: keyof ColMap) => {
        const col = colMap[key]
        if (!col) return ""
        const i = parsedFile.headers.indexOf(col)
        return i >= 0 ? (row[i] ?? "") : ""
      }
      return {
        idx,
        group: get("group"),
        date: get("date"),
        time: get("time"),
        team1: get("team1"),
        team2: get("team2"),
        facility: get("facility"),
        field: get("field"),
      }
    }).filter(r => r.group || r.team1 || r.team2)
  }, [parsedFile, colMap])

  const groupedRows = useMemo(() => {
    const map = new Map<string, MappedRow[]>()
    mappedRows.forEach(row => {
      const key = row.group || "(No Group)"
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(row)
    })
    return Array.from(map.entries()).map(([rawGroup, rows]) => ({ rawGroup, rows }))
  }, [mappedRows])

  // ── Preview init ──────────────────────────────────────────────────────────

  const initPreview = () => {
    const gRes: Record<string, string | null> = {}
    const tRes: Record<string, TeamRes> = {}
    const lRes: Record<string, LocRes> = {}
    const rMap: Record<number, { home: boolean; away: boolean }> = {}
    const leads: Record<string, string> = {}

    groupedRows.forEach(({ rawGroup, rows }) => {
      const matchedGroup = bestMatch(rawGroup, groups, g => g.name)
      gRes[rawGroup] = matchedGroup?.id ?? null
      if (matchedGroup?.leadCoachId) leads[rawGroup] = matchedGroup.leadCoachId

      const groupTeams = matchedGroup?.teams ?? []

      rows.forEach(row => {
        for (const rawTeam of [row.team1, row.team2]) {
          const tKey = `${rawGroup}|||${rawTeam}`
          if (rawTeam && !tRes[tKey]) {
            const match = bestMatch(rawTeam, groupTeams, t => t.name)
            tRes[tKey] = match
              ? { action: "existing", teamId: match.id, teamName: match.name }
              : { action: "new", teamName: rawTeam }
          }
        }
        if (row.facility && !lRes[row.facility]) {
          const match = bestMatch(row.facility, locations, l => l.name)
          lRes[row.facility] = match
            ? { action: "existing", locationId: match.id, name: match.name, address: "" }
            : { action: "new", name: row.facility, address: "" }
        }
        rMap[row.idx] = { home: false, away: false }
      })
    })

    setGroupRes(gRes)
    setTeamRes(tRes)
    setLocRes(lRes)
    setRosters(rMap)
    setGroupLeads(leads)
    setStep("preview")
  }

  // ── Preview helpers ───────────────────────────────────────────────────────

  const getGroup = (rawGroup: string) => groups.find(g => g.id === groupRes[rawGroup])
  const hasUnresolvedGroups = groupedRows.some(({ rawGroup }) => !groupRes[rawGroup])

  const updateGroupResolution = (rawGroup: string, gId: string) => {
    setGroupRes(prev => ({ ...prev, [rawGroup]: gId }))
    const g = groups.find(g => g.id === gId)
    if (g?.leadCoachId) setGroupLeads(prev => ({ ...prev, [rawGroup]: g.leadCoachId! }))
    // Re-resolve teams with new group's team list
    const gTeams = g?.teams ?? []
    const uniqueTeams = [...new Set(
      (groupedRows.find(gr => gr.rawGroup === rawGroup)?.rows ?? [])
        .flatMap(r => [r.team1, r.team2])
        .filter(Boolean)
    )]
    setTeamRes(prev => {
      const next = { ...prev }
      uniqueTeams.forEach(rawTeam => {
        const match = bestMatch(rawTeam, gTeams, t => t.name)
        next[`${rawGroup}|||${rawTeam}`] = match
          ? { action: "existing", teamId: match.id, teamName: match.name }
          : { action: "new", teamName: rawTeam }
      })
      return next
    })
  }

  // ── Build save payload ────────────────────────────────────────────────────

  const buildPayload = (status: "draft" | "active") => {
    const newTeams: Array<{ groupId: string; name: string }> = []

    const groupPayloads = groupedRows
      .filter(({ rawGroup }) => !!groupRes[rawGroup])
      .map(({ rawGroup, rows }) => {
        const groupId = groupRes[rawGroup]!
        const groupTeams = getGroup(rawGroup)?.teams ?? []

        const seenNew = new Set<string>()
        const allTeamNames = [...new Set(rows.flatMap(r => [r.team1, r.team2]).filter(Boolean))]
        allTeamNames.forEach(rawTeam => {
          const res = teamRes[`${rawGroup}|||${rawTeam}`]
          if (res?.action === "new" && !seenNew.has(res.teamName)) {
            seenNew.add(res.teamName)
            newTeams.push({ groupId, name: res.teamName })
          }
        })

        return {
          groupId,
          leadCoachId: groupLeads[rawGroup] || null,
          games: rows.map(row => {
            const resolveTeam = (rawTeam: string) =>
              teamRes[`${rawGroup}|||${rawTeam}`]?.teamName ?? rawTeam
            const lRes = row.facility ? locRes[row.facility] : undefined
            return {
              date: parseDate(row.date),
              time: parseTime(row.time),
              homeTeam: resolveTeam(row.team1),
              awayTeam: resolveTeam(row.team2),
              field: row.field || null,
              locationId: lRes?.action === "existing" ? lRes.locationId! : null,
              newLocation: lRes?.action === "new" ? { name: lRes.name, address: lRes.address } : null,
              buildHomeRoster: rosters[row.idx]?.home ?? false,
              buildAwayRoster: rosters[row.idx]?.away ?? false,
            }
          }),
        }
      })

    // Deduplicate newTeams by groupId+name
    const deduped = Array.from(
      new Map(newTeams.map(t => [`${t.groupId}:${t.name}`, t])).values()
    )

    return { name, status, accountId, groups: groupPayloads, newTeams: deduped }
  }

  const handleSave = (status: "draft" | "active") => {
    const payload = buildPayload(status)
    startTransition(async () => {
      try {
        const id = await createGameDay(payload)
        handleOpenChange(false)
        router.push(`/game-day/${id}`)
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create game day")
      }
    })
  }

  // ── Validation ────────────────────────────────────────────────────────────

  const isMappingValid = REQUIRED_FIELDS.every(f => colMap[f.key])
  const stepIndex = { details: 0, upload: 1, mapping: 2, preview: 3 }[step]

  const goBack = () => {
    if (step === "preview") setStep("mapping")
    else if (step === "mapping") setStep("upload")
    else if (step === "upload") setStep("details")
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Play className="mr-2 size-4" />
          New Game Day
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "transition-all duration-200",
          step === "preview" ? "sm:max-w-5xl" :
          step === "mapping" ? "sm:max-w-2xl" : "sm:max-w-md"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {step === "details" && "Create New Game Day"}
            {step === "upload" && "Upload Schedule"}
            {step === "mapping" && "Map Columns"}
            {step === "preview" && "Preview & Configure"}
          </DialogTitle>
          <DialogDescription>
            {step === "details" && "Give the game day a name."}
            {step === "upload" && "Upload a CSV or Excel file with your schedule."}
            {step === "mapping" && "Match your file's columns to the required fields."}
            {step === "preview" && "Review games, confirm team and location matches, and toggle rosters."}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2, 3].map(i => (
            <span key={i} className="contents">
              <div className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                i <= stepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {i < stepIndex ? <Check className="size-4" /> : i + 1}
              </div>
              {i < 3 && <div className="h-px w-8 bg-border" />}
            </span>
          ))}
        </div>

        {/* ── Step 1: Details ─────────────────────────────────────────────── */}
        {step === "details" && (
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Game Day Name</FieldLabel>
              <Input
                placeholder="e.g., Spring Tournament 2026"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && name.trim() && setStep("upload")}
                autoFocus
              />
            </Field>
          </div>
        )}

        {/* ── Step 2: Upload ──────────────────────────────────────────────── */}
        {step === "upload" && (
          <div className="flex flex-col gap-4">
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onDrop={e => {
                e.preventDefault()
                setIsDragging(false)
                const file = e.dataTransfer.files[0]
                if (file) processFile(file)
              }}
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
            >
              <FileSpreadsheet className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm font-medium">Drag and drop your schedule file here</p>
              <p className="mt-1 text-xs text-muted-foreground">Supports CSV, Excel (.xlsx, .xls)</p>
              <label htmlFor="file-upload" className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="mr-2 size-4" />
                    Browse Files
                  </span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="sr-only"
                  onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }}
                />
              </label>
            </div>
          </div>
        )}

        {/* ── Step 3: Column mapping ──────────────────────────────────────── */}
        {step === "mapping" && parsedFile && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <FileSpreadsheet className="size-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{parsedFile.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {parsedFile.headers.length} columns · {parsedFile.rows.length} rows
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setParsedFile(null); setStep("upload") }}>
                Change
              </Button>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Required</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {REQUIRED_FIELDS.map(f => (
                  <Field key={f.key}>
                    <FieldLabel className="flex items-center gap-1">
                      {f.label}
                      {colMap[f.key] && <Check className="size-3 text-green-600" />}
                    </FieldLabel>
                    <Select
                      value={colMap[f.key]}
                      onValueChange={v => setColMap(prev => ({ ...prev, [f.key]: v }))}
                    >
                      <SelectTrigger><SelectValue placeholder="Select column" /></SelectTrigger>
                      <SelectContent>
                        {parsedFile.headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Optional</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {OPTIONAL_FIELDS.map(f => (
                  <Field key={f.key}>
                    <FieldLabel className="flex items-center gap-1">
                      {f.label}
                      {colMap[f.key] && <Check className="size-3 text-green-600" />}
                    </FieldLabel>
                    <Select
                      value={colMap[f.key] || "_none"}
                      onValueChange={v => setColMap(prev => ({ ...prev, [f.key]: v === "_none" ? "" : v }))}
                    >
                      <SelectTrigger><SelectValue placeholder="Skip" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">Skip this field</SelectItem>
                        {parsedFile.headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                ))}
              </div>
            </div>

            {/* Data preview */}
            <div className="rounded-lg border">
              <div className="border-b bg-muted/50 px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">Sample data (first 3 rows)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {[...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].map(f => (
                        <th key={f.key} className="px-3 py-2 text-left font-medium">{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedFile.rows.slice(0, 3).map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        {[...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].map(f => {
                          const ci = parsedFile.headers.indexOf(colMap[f.key])
                          return (
                            <td key={f.key} className="px-3 py-2 text-muted-foreground">
                              {ci >= 0 ? row[ci] || "—" : "—"}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Preview & configure ─────────────────────────────────── */}
        {step === "preview" && (
          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
            {/* Summary badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{mappedRows.length} games</Badge>
              <Badge variant="secondary">{groupedRows.length} groups</Badge>
              {hasUnresolvedGroups && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="size-3" />
                  Unresolved groups — must fix before saving
                </Badge>
              )}
            </div>

            {/* Location mapping */}
            {Object.keys(locRes).length > 0 && (
              <div className="rounded-lg border">
                <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Location Mapping</p>
                </div>
                <div className="divide-y">
                  {Object.entries(locRes).map(([rawFac, res]) => (
                    <div key={rawFac} className="flex items-start gap-3 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-muted-foreground">{rawFac}</p>
                        {res.action === "new" && (
                          <Input
                            className="mt-1 h-7 text-xs"
                            placeholder="Address (optional)"
                            value={res.address}
                            onChange={e =>
                              setLocRes(prev => ({ ...prev, [rawFac]: { ...res, address: e.target.value } }))
                            }
                          />
                        )}
                      </div>
                      <div className="w-56 shrink-0">
                        <Select
                          value={res.action === "existing" ? res.locationId! : LOC_NEW}
                          onValueChange={v => {
                            if (v === LOC_NEW) {
                              setLocRes(prev => ({ ...prev, [rawFac]: { action: "new", name: rawFac, address: "" } }))
                            } else {
                              const loc = locations.find(l => l.id === v)!
                              setLocRes(prev => ({ ...prev, [rawFac]: { action: "existing", locationId: v, name: loc.name, address: "" } }))
                            }
                          }}
                        >
                          <SelectTrigger className={cn("h-8 text-xs", res.action === "existing" ? "border-green-500" : "border-blue-400")}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={LOC_NEW} className="text-blue-600">+ Add as new location</SelectItem>
                            {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group sections */}
            {groupedRows.map(({ rawGroup, rows }) => {
              const resolvedGroupId = groupRes[rawGroup]
              const resolvedGroup = getGroup(rawGroup)
              const groupTeams = resolvedGroup?.teams ?? []
              const leadId = groupLeads[rawGroup] ?? ""

              const uniqueTeams = [...new Set(rows.flatMap(r => [r.team1, r.team2]).filter(Boolean))]
              // Teams that defaulted to "new" — show them so user can optionally link
              const newTeams = groupTeams.length > 0
                ? uniqueTeams.filter(t => teamRes[`${rawGroup}|||${t}`]?.action === "new")
                : []

              return (
                <div key={rawGroup} className="rounded-lg border">
                  {/* Group header */}
                  <div className="flex flex-wrap items-center gap-3 border-b bg-muted/40 px-3 py-2">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      {resolvedGroupId ? (
                        <Badge className="border-green-300 bg-green-100 text-green-800 shrink-0">
                          <Check className="mr-1 size-3" />
                          {resolvedGroup?.name}
                        </Badge>
                      ) : (
                        <>
                          <Badge variant="destructive" className="shrink-0 gap-1">
                            <AlertTriangle className="size-3" />
                            {rawGroup}
                          </Badge>
                          <Select
                            value={resolvedGroupId ?? ""}
                            onValueChange={gId => updateGroupResolution(rawGroup, gId)}
                          >
                            <SelectTrigger className="h-7 w-40 text-xs">
                              <SelectValue placeholder="Link to group…" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <span>Lead:</span>
                      <Select
                        value={leadId}
                        onValueChange={id => setGroupLeads(prev => ({ ...prev, [rawGroup]: id }))}
                      >
                        <SelectTrigger className="h-7 w-36 text-xs">
                          <SelectValue placeholder="Select coach" />
                        </SelectTrigger>
                        <SelectContent>
                          {coaches.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* New team mapping — only shown when group has existing teams to link against */}
                  {newTeams.length > 0 && (
                    <div className="border-b bg-amber-50/50 px-3 py-2">
                      <p className="mb-2 flex items-center gap-1 text-xs font-medium text-amber-700">
                        <Users className="size-3" />
                        New teams — link to existing if needed
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {newTeams.map(rawTeam => {
                          const tKey = `${rawGroup}|||${rawTeam}`
                          const res = teamRes[tKey]
                          return (
                            <div key={rawTeam} className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground">{rawTeam}</span>
                              <Select
                                value={res?.action === "existing" ? res.teamId! : TEAM_NEW}
                                onValueChange={v => {
                                  if (v === TEAM_NEW) {
                                    setTeamRes(prev => ({ ...prev, [tKey]: { action: "new", teamName: rawTeam } }))
                                  } else {
                                    const t = groupTeams.find(t => t.id === v)!
                                    setTeamRes(prev => ({ ...prev, [tKey]: { action: "existing", teamId: v, teamName: t.name } }))
                                  }
                                }}
                              >
                                <SelectTrigger className="h-6 w-36 border-blue-400 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={TEAM_NEW} className="text-blue-600">Add as new team</SelectItem>
                                  {groupTeams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Games table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/20">
                          <th className="px-3 py-1.5 text-left font-medium">Home Team</th>
                          <th className="w-8 px-2 py-1.5 text-center font-medium" title="Build roster">R</th>
                          <th className="w-6 px-2 py-1.5 text-center text-muted-foreground">vs</th>
                          <th className="px-3 py-1.5 text-left font-medium">Away Team</th>
                          <th className="w-8 px-2 py-1.5 text-center font-medium" title="Build roster">R</th>
                          {colMap.date && <th className="px-3 py-1.5 text-left font-medium">Date</th>}
                          {colMap.time && <th className="px-3 py-1.5 text-left font-medium">Time</th>}
                          {colMap.facility && <th className="px-3 py-1.5 text-left font-medium">Location</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map(row => {
                          const t1Res = teamRes[`${rawGroup}|||${row.team1}`]
                          const t2Res = teamRes[`${rawGroup}|||${row.team2}`]
                          const lRes = row.facility ? locRes[row.facility] : undefined
                          const roster = rosters[row.idx] ?? { home: false, away: false }

                          return (
                            <tr key={row.idx} className="border-b last:border-0 hover:bg-muted/20">
                              <td className="px-3 py-1.5">
                                <span className={cn("font-medium", t1Res?.action === "existing" ? "text-green-700" : "text-blue-700")}>
                                  {t1Res?.teamName ?? row.team1}
                                </span>
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                <Checkbox
                                  checked={roster.home}
                                  onCheckedChange={v =>
                                    setRosters(prev => ({ ...prev, [row.idx]: { ...roster, home: !!v } }))
                                  }
                                />
                              </td>
                              <td className="px-2 py-1.5 text-center text-muted-foreground">vs</td>
                              <td className="px-3 py-1.5">
                                <span className={cn("font-medium", t2Res?.action === "existing" ? "text-green-700" : "text-blue-700")}>
                                  {t2Res?.teamName ?? row.team2}
                                </span>
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                <Checkbox
                                  checked={roster.away}
                                  onCheckedChange={v =>
                                    setRosters(prev => ({ ...prev, [row.idx]: { ...roster, away: !!v } }))
                                  }
                                />
                              </td>
                              {colMap.date && (
                                <td className="whitespace-nowrap px-3 py-1.5 text-muted-foreground">{row.date || "—"}</td>
                              )}
                              {colMap.time && (
                                <td className="whitespace-nowrap px-3 py-1.5 text-muted-foreground">{row.time || "—"}</td>
                              )}
                              {colMap.facility && (
                                <td className="px-3 py-1.5 text-muted-foreground">
                                  <span className={cn(lRes?.action === "existing" ? "text-green-700" : "text-blue-700")}>
                                    {lRes?.name ?? row.facility}
                                  </span>
                                  {row.field && <span className="text-muted-foreground"> · {row.field}</span>}
                                </td>
                              )}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="gap-2 sm:gap-0">
          {step !== "details" && (
            <Button variant="outline" onClick={goBack} disabled={isPending}>
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
          )}
          <div className="flex gap-2">
            {step === "details" && (
              <Button onClick={() => setStep("upload")} disabled={!name.trim()}>
                Next
                <ArrowRight className="ml-2 size-4" />
              </Button>
            )}
            {step === "upload" && (
              <p className="self-center text-xs text-muted-foreground">Upload a file to continue</p>
            )}
            {step === "mapping" && (
              <Button onClick={initPreview} disabled={!isMappingValid}>
                Preview
                <ArrowRight className="ml-2 size-4" />
              </Button>
            )}
            {step === "preview" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSave("draft")}
                  disabled={isPending || hasUnresolvedGroups}
                >
                  {isPending ? "Saving…" : "Save as Draft"}
                </Button>
                <Button
                  onClick={() => handleSave("active")}
                  disabled={isPending || hasUnresolvedGroups}
                >
                  {isPending ? "Saving…" : "Release to Leads"}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
