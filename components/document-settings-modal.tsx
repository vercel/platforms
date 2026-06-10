"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { FileText } from "lucide-react"

interface DocumentSettingsModalProps {
  groupName: string
  gameDayName: string
}

export function DocumentSettingsModal({ groupName, gameDayName }: DocumentSettingsModalProps) {
  const [open, setOpen] = useState(false)
  const [documentType, setDocumentType] = useState<"schedule-only" | "schedule-roster">("schedule-only")
  
  // Default to today's date and current time
  const now = new Date()
  const defaultDate = now.toISOString().slice(0, 16)
  const [publishDate, setPublishDate] = useState(defaultDate)

  const handleGenerate = () => {
    // Here you would generate the document
    console.log("Generating document:", {
      groupName,
      gameDayName,
      documentType,
      publishDate,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Documents">
          <FileText className="size-4" />
          <span className="sr-only">Document Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Game Day Documentation</DialogTitle>
          <DialogDescription>
            Configure documentation settings for {groupName} - {gameDayName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">Document Type</Label>
            <RadioGroup
              value={documentType}
              onValueChange={(value) => setDocumentType(value as "schedule-only" | "schedule-roster")}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="schedule-only" id="schedule-only" />
                <Label htmlFor="schedule-only" className="flex-1 cursor-pointer">
                  <div className="font-medium">Schedule Only</div>
                  <div className="text-sm text-muted-foreground">
                    Generate a document with game times, teams, and field assignments
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="schedule-roster" id="schedule-roster" />
                <Label htmlFor="schedule-roster" className="flex-1 cursor-pointer">
                  <div className="font-medium">Schedule and Roster</div>
                  <div className="text-sm text-muted-foreground">
                    Include player assignments and roster details with the schedule
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="publish-date" className="text-sm font-medium">
              Publish Date
            </Label>
            <Input
              id="publish-date"
              type="datetime-local"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              The document will be available to view starting from this date and time
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate}>
            Generate Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
