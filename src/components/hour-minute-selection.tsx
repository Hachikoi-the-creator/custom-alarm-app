import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TimeFormat = "12h" | "24h"

type HourMinuteSelectionProps = {
  hour: string
  minutes: string
  timeFormat: TimeFormat
  onHourChange: (hour: string) => void
  onMinutesChange: (minutes: string) => void
  className?: string
}

export default function HourMinuteSelection({
  hour,
  minutes,
  timeFormat,
  onHourChange,
  onMinutesChange,
  className
}: HourMinuteSelectionProps) {
  const [showHourDropdown, setShowHourDropdown] = useState(false)
  const [showMinutesDropdown, setShowMinutesDropdown] = useState(false)

  // Generate hour options based on time format
  const getHourOptions = () => {
    if (timeFormat === "12h") {
      return Array.from({ length: 12 }, (_, i) => ({
        value: (i + 1).toString().padStart(2, "0"),
        label: (i + 1).toString().padStart(2, "0")
      }))
    } else {
      return Array.from({ length: 24 }, (_, i) => ({
        value: i.toString().padStart(2, "0"),
        label: i.toString().padStart(2, "0")
      }))
    }
  }

  // Generate minute options
  const getMinuteOptions = () => {
    return Array.from({ length: 60 }, (_, i) => ({
      value: i.toString().padStart(2, "0"),
      label: i.toString().padStart(2, "0")
    }))
  }

  // Format display time
  const formatDisplayTime = (hour: string, minutes: string) => {
    if (timeFormat === "12h") {
      const h = parseInt(hour)
      const ampm = h >= 12 ? "PM" : "AM"
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
      return `${displayHour.toString().padStart(2, "0")}:${minutes} ${ampm}`
    }
    return `${hour}:${minutes}`
  }

  const handleHourSelect = (selectedHour: string) => {
    onHourChange(selectedHour)
    setShowHourDropdown(false)
  }

  const handleMinuteSelect = (selectedMinute: string) => {
    onMinutesChange(selectedMinute)
    setShowMinutesDropdown(false)
  }

  return (
    <div className={cn("flex items-center gap-2 w-fit", className)}>
      {/* Hour Selection */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowHourDropdown(!showHourDropdown)}
          onBlur={() => setTimeout(() => setShowHourDropdown(false), 150)}
          className="w-20 h-16 text-3xl font-bold font-mono flex items-center justify-between px-3 text-primary border-primary hover:bg-primary/10"
        >
          <span>{hour}</span>
          <ChevronDown className="h-5 w-5 ml-2" />
        </Button>
        
        {showHourDropdown && (
          <div 
            className="absolute top-full left-0 mt-1 w-20 max-h-48 bg-background border border-border rounded-md shadow-lg z-50 overflow-hidden"
            onBlur={() => setShowHourDropdown(false)}
          >
            <div className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {getHourOptions().map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleHourSelect(option.value)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-lg font-mono hover:bg-accent hover:text-accent-foreground transition-colors",
                    option.value === hour && "bg-primary text-primary-foreground"
                  )}
                >
                  {option.value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Separator */}
      <span className="text-4xl font-bold text-primary">:</span>

      {/* Minutes Selection */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowMinutesDropdown(!showMinutesDropdown)}
          onBlur={() => setTimeout(() => setShowMinutesDropdown(false), 150)}
          className="w-20 h-16 text-3xl font-bold font-mono flex items-center justify-between px-3 text-primary border-primary hover:bg-primary/10"
        >
          <span>{minutes}</span>
          <ChevronDown className="h-5 w-5 ml-2" />
        </Button>
        
        {showMinutesDropdown && (
          <div 
            className="absolute top-full left-0 mt-1 w-20 max-h-48 bg-background border border-border rounded-md shadow-lg z-50 overflow-hidden"
            onBlur={() => setShowMinutesDropdown(false)}
          >
            <div className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {getMinuteOptions().map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMinuteSelect(option.value)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-lg font-mono hover:bg-accent hover:text-accent-foreground transition-colors",
                    option.value === minutes && "bg-primary text-primary-foreground"
                  )}
                >
                  {option.value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}