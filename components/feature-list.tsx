import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureListProps {
  items: string[]
  className?: string
}

export function FeatureList({ items, className }: FeatureListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-2 text-left text-sm text-foreground"
        >
          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}
