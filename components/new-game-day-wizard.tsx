"use client"

import { useState, useCallback } from "react"
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
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Play, CalendarIcon, Upload, FileSpreadsheet, Check, X, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

type Step = "details" | "upload" | "mapping"

interface ColumnMapping {
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

const requiredFields = [
  { key: "group", label: "Group" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "team1", label: "Team 1" },
  { key: "team2", label: "Team 2" },
  { key: "facility", label: "Facility" },
  { key: "field", label: "Field" },
] as const

export function NewGameDayWizard() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("details")
  
  // Step 1: Details
  const [name, setName] = useState("")
  const [dates, setDates] = useState<Date[]>([])
  const [calendarOpen, setCalendarOpen] = useState(false)
  
  // Step 2: Upload
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Step 3: Mapping
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    group: "",
    date: "",
    time: "",
    team1: "",
    team2: "",
    facility: "",
    field: "",
  })

  const resetWizard = () => {
    setStep("details")
    setName("")
    setDates([])
    setParsedFile(null)
    setColumnMapping({
      group: "",
      date: "",
      time: "",
      team1: "",
      team2: "",
      facility: "",
      field: "",
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetWizard()
    }
  }

  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.trim().split("\n")
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""))
    const rows = lines.slice(1).map(line => {
      // Handle quoted values with commas
      const values: string[] = []
      let current = ""
      let inQuotes = false
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())
      return values
    })
    return { headers, rows }
  }

  const autoMapColumns = (headers: string[]) => {
    const mapping: ColumnMapping = {
      group: "",
      date: "",
      time: "",
      team1: "",
      team2: "",
      facility: "",
      field: "",
    }

    const lowerHeaders = headers.map(h => h.toLowerCase())

    // Auto-detect common column names
    lowerHeaders.forEach((header, index) => {
      const originalHeader = headers[index]
      if (header.includes("group") || header.includes("age") || header.includes("division")) {
        mapping.group = originalHeader
      } else if (header.includes("date")) {
        mapping.date = originalHeader
      } else if (header.includes("time") || header.includes("start")) {
        mapping.time = originalHeader
      } else if (header.includes("team 1") || header.includes("team1") || header.includes("home")) {
        mapping.team1 = originalHeader
      } else if (header.includes("team 2") || header.includes("team2") || header.includes("away") || header.includes("visitor")) {
        mapping.team2 = originalHeader
      } else if (header.includes("facility") || header.includes("location") || header.includes("venue")) {
        mapping.facility = originalHeader
      } else if (header.includes("field") || header.includes("court") || header.includes("pitch")) {
        mapping.field = originalHeader
      }
    })

    setColumnMapping(mapping)
  }

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (file.name.endsWith(".csv")) {
        const { headers, rows } = parseCSV(text)
        setParsedFile({ headers, rows, fileName: file.name })
        autoMapColumns(headers)
        setStep("mapping")
      } else {
        // For Excel files, we'd need a library like xlsx
        // For now, show an error or handle differently
        alert("Excel file support coming soon. Please use CSV format.")
      }
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping(prev => ({ ...prev, [field]: value }))
  }

  const isDetailsValid = name.trim() && dates.length > 0
  const isMappingValid = Object.values(columnMapping).every(v => v !== "")

  const handleCreate = () => {
    // Here you would create the game day with the parsed data
    console.log("Creating game day:", {
      name,
      dates,
      mapping: columnMapping,
      data: parsedFile,
    })
    handleOpenChange(false)
  }

  const formatDateRange = () => {
    if (dates.length === 0) return "Select dates"
    if (dates.length === 1) return format(dates[0], "MMM d, yyyy")
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime())
    return `${format(sorted[0], "MMM d")} - ${format(sorted[sorted.length - 1], "MMM d, yyyy")}`
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Play className="mr-2 size-4" />
          New Game Day
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "transition-all duration-200",
        step === "mapping" ? "sm:max-w-2xl" : "sm:max-w-md"
      )}>
        <DialogHeader>
          <DialogTitle>
            {step === "details" && "Create New Game Day"}
            {step === "upload" && "Upload Schedule"}
            {step === "mapping" && "Map Columns"}
          </DialogTitle>
          <DialogDescription>
            {step === "details" && "Enter the basic details for your game day."}
            {step === "upload" && "Upload a CSV or Excel file with your schedule."}
            {step === "mapping" && "Match your file columns to the required fields."}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2">
          <div className={cn(
            "flex size-8 items-center justify-center rounded-full text-sm font-medium",
            step === "details" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {step !== "details" ? <Check className="size-4" /> : "1"}
          </div>
          <div className="h-px w-8 bg-border" />
          <div className={cn(
            "flex size-8 items-center justify-center rounded-full text-sm font-medium",
            step === "upload" ? "bg-primary text-primary-foreground" : 
            step === "mapping" ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground"
          )}>
            {step === "mapping" ? <Check className="size-4" /> : "2"}
          </div>
          <div className="h-px w-8 bg-border" />
          <div className={cn(
            "flex size-8 items-center justify-center rounded-full text-sm font-medium",
            step === "mapping" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            3
          </div>
        </div>

        {/* Step 1: Details */}
        {step === "details" && (
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Game Day Name</FieldLabel>
              <Input
                placeholder="e.g., Spring Tournament 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Date(s)</FieldLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      dates.length === 0 && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="multiple"
                    selected={dates}
                    onSelect={(newDates) => setDates(newDates || [])}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-1">
                Select one or multiple dates for your game day
              </p>
            </Field>
            {dates.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {[...dates].sort((a, b) => a.getTime() - b.getTime()).map((date, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {format(date, "MMM d, yyyy")}
                    <button
                      onClick={() => setDates(dates.filter((_, index) => index !== i))}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Upload */}
        {step === "upload" && (
          <div className="flex flex-col gap-4">
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <FileSpreadsheet className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm font-medium">
                Drag and drop your schedule file here
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supports CSV and Excel files
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">or</span>
              </div>
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" className="mt-2" asChild>
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
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Mapping */}
        {step === "mapping" && parsedFile && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <FileSpreadsheet className="size-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{parsedFile.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {parsedFile.headers.length} columns, {parsedFile.rows.length} rows
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setParsedFile(null)
                  setStep("upload")
                }}
              >
                Change
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {requiredFields.map((field) => (
                <Field key={field.key}>
                  <FieldLabel className="flex items-center gap-2">
                    {field.label}
                    {columnMapping[field.key] && (
                      <Check className="size-3 text-green-600" />
                    )}
                  </FieldLabel>
                  <Select
                    value={columnMapping[field.key]}
                    onValueChange={(value) => handleMappingChange(field.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {parsedFile.headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              ))}
            </div>

            {/* Preview */}
            <div className="rounded-lg border">
              <div className="border-b bg-muted/50 px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">Preview (first 3 rows)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {requiredFields.map((field) => (
                        <th key={field.key} className="px-3 py-2 text-left font-medium">
                          {field.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedFile.rows.slice(0, 3).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b last:border-0">
                        {requiredFields.map((field) => {
                          const colIndex = parsedFile.headers.indexOf(columnMapping[field.key])
                          return (
                            <td key={field.key} className="px-3 py-2 text-muted-foreground">
                              {colIndex >= 0 ? row[colIndex] || "-" : "-"}
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

        <DialogFooter className="gap-2 sm:gap-0">
          {step !== "details" && (
            <Button
              variant="outline"
              onClick={() => setStep(step === "mapping" ? "upload" : "details")}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
          )}
          {step === "details" && (
            <Button onClick={() => setStep("upload")} disabled={!isDetailsValid}>
              Next
              <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
          {step === "upload" && (
            <Button variant="outline" onClick={() => setStep("mapping")} disabled={!parsedFile}>
              Skip Upload
            </Button>
          )}
          {step === "mapping" && (
            <Button onClick={handleCreate} disabled={!isMappingValid}>
              Create Game Day
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
