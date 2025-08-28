import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Plus, Trash2, Loader2, Calendar } from "lucide-react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabase"
import { useUserStore } from "@/context/user-context"
import HourMinuteSelection from "@/components/hour-minute-selection"
import { toast } from "sonner"

type CustomAlarmStep = {
  id: string
  song: string
  volume: number
  hour: string
  minutes: string
}

type Alarm = {
  id: string
  user_id: string
  name: string
  hour: number
  minutes: number
  days_active: number[]
  is_active: boolean
  stop_method: string
  custom_snooze: any
  steps: any
  snooze_duration_minutes: number
  snooze_max_count: number | null
  created_at: string
  updated_at: string
}

type DayOption = {
  value: number
  label: string
  shortLabel: string
}

const DAY_OPTIONS: DayOption[] = [
  { value: 0, label: "Sunday", shortLabel: "Sun" },
  { value: 1, label: "Monday", shortLabel: "Mon" },
  { value: 2, label: "Tuesday", shortLabel: "Tue" },
  { value: 3, label: "Wednesday", shortLabel: "Wed" },
  { value: 4, label: "Thursday", shortLabel: "Thu" },
  { value: 5, label: "Friday", shortLabel: "Fri" },
  { value: 6, label: "Saturday", shortLabel: "Sat" },
]

const STOP_METHODS = [
  "default",
  "math_puzzle",
  "captcha",
  "shake_device",
  "tap_sequence",
  "voice_command",
  "simple_dismiss"
]

export default function EditAddAlarm({ 
  isNew, 
  alarmId 
}: { 
  isNew: boolean
  alarmId?: string 
}) {
  // Debug logging for props
  console.log('EditAddAlarm component rendered with props:', { 
    isNew, 
    alarmId, 
    isNewType: typeof isNew,
    isNewBoolean: Boolean(isNew),
    isNewStrict: isNew === true
  })
  
  // Add useEffect to track component lifecycle
  useEffect(() => {
    console.log('EditAddAlarm component mounted with isNew:', isNew)
    return () => {
      console.log('EditAddAlarm component unmounting, isNew was:', isNew)
    }
  }, [isNew])
  
  const router = useRouter()
  const { user } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Form state
  const [alarmName, setAlarmName] = useState("")
  const [startTime, setStartTime] = useState({ hour: "07", minutes: "00" })
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h")
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [stopMethod, setStopMethod] = useState("default")
  const [snoozeDuration, setSnoozeDuration] = useState(5)
  const [snoozeMaxCount, setSnoozeMaxCount] = useState(3)
  const [repeatMode, setRepeatMode] = useState<"simple" | "volume" | "custom">("simple")
  const [repeatTimes, setRepeatTimes] = useState("3")
  const [repeatInterval, setRepeatInterval] = useState("5")
  const [volumeIncrease, setVolumeIncrease] = useState("20")
  const [customSteps, setCustomSteps] = useState<CustomAlarmStep[]>([
    { id: "1", song: "Default Alarm", volume: 50, hour: "07", minutes: "00" },
  ])

  // Load existing alarm data if editing
  useEffect(() => {
    if (!isNew && alarmId && user.id) {
      loadAlarmData()
    }
  }, [isNew, alarmId, user.id])

  const loadAlarmData = async () => {
    if (!user.id) return
    
    try {
      const { data, error } = await supabase
        .from("alarms")
        .select("*")
        .eq("id", alarmId)
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.error('Error loading alarm:', error)
        toast.error("Failed to load alarm data")
        return
      }

      if (data) {
        setAlarmName(data.name)
        setStartTime({ 
          hour: data.hour.toString().padStart(2, "0"), 
          minutes: data.minutes.toString().padStart(2, "0") 
        })
        setSelectedDays(data.days_active || [])
        setStopMethod(data.stop_method)
        setSnoozeDuration(data.snooze_duration_minutes)
        setSnoozeMaxCount(data.snooze_max_count || 3)
        
        // Reset custom steps since we're not using them in the current schema
        setCustomSteps([
          { id: "1", song: "Default Alarm", volume: 50, hour: "07", minutes: "00" }
        ])
      }
    } catch (err) {
      console.error('Error loading alarm:', err)
      toast.error("Failed to load alarm data")
    }
  }

  const formatTime = (hour: string, minutes: string) => {
    if (timeFormat === "12h") {
      const h = Number.parseInt(hour)
      const ampm = h >= 12 ? "PM" : "AM"
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
      return `${displayHour.toString().padStart(2, "0")}:${minutes} ${ampm}`
    }
    return `${hour}:${minutes}`
  }

  const addCustomStep = () => {
    const lastStep = customSteps[customSteps.length - 1]
    const newStep: CustomAlarmStep = {
      id: Date.now().toString(),
      song: lastStep.song,
      volume: lastStep.volume,
      hour: lastStep.hour,
      minutes: lastStep.minutes,
    }
    setCustomSteps([...customSteps, newStep])
  }

  const removeCustomStep = (id: string) => {
    if (customSteps.length > 1) {
      setCustomSteps(customSteps.filter((step) => step.id !== id))
    }
  }

  const updateCustomStep = (id: string, field: keyof CustomAlarmStep, value: string | number) => {
    setCustomSteps(customSteps.map((step) => (step.id === id ? { ...step, [field]: value } : step)))
  }

  const toggleDay = (dayValue: number) => {
    setSelectedDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue]
    )
  }

  const validateForm = () => {
    if (!alarmName.trim()) {
      toast.error("Please enter an alarm name")
      return false
    }
    if (!user.id) {
      toast.error("User not authenticated")
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    // Debug logging
    console.log('handleSave called with:', { isNew, alarmId, user: user?.id })

    try {
      // Convert time format to 24-hour for database
      let hour = parseInt(startTime.hour)
      if (timeFormat === "12h" && startTime.hour === "12") {
        hour = 0
      } else if (timeFormat === "12h" && parseInt(startTime.hour) > 12) {
        hour = parseInt(startTime.hour) - 12
      }

      const alarmData = {
        user_id: user!.id, // We know user exists here due to validateForm check
        name: alarmName.trim(),
        hour: hour,
        minutes: parseInt(startTime.minutes),
        days_active: selectedDays.length > 0 ? selectedDays : null,
        is_active: true,
        stop_method: stopMethod,
        custom_snooze: null,
        steps: null,
        snooze_duration_minutes: snoozeDuration,
        snooze_max_count: snoozeMaxCount
      }

      console.log('About to save alarm data:', alarmData)
      console.log('isNew value:', isNew)
      console.log('isNew === true:', isNew === true)
      console.log('isNew === false:', isNew === false)
      console.log('Boolean(isNew):', Boolean(isNew))
      console.log('typeof isNew:', typeof isNew)

      let result
      if (isNew) {
        console.log('Creating new alarm...')
        // Create new alarm
        const { data, error } = await supabase
          .from("alarms")
          .insert([alarmData])
          .select()

        if (error) {
          console.error('Error creating alarm:', error)
          toast.error("Failed to create alarm")
          return
        }

        result = data
        toast.success("Alarm created successfully!")
      } else {
        console.log('Updating existing alarm...')
        // Update existing alarm
        const { data, error } = await supabase
          .from("alarms")
          .update(alarmData)
          .eq("id", alarmId)
          .eq("user_id", user!.id) // We know user exists here due to validateForm check
          .select()

        if (error) {
          console.error('Error updating alarm:', error)
          toast.error("Failed to update alarm")
          return
        }

        result = data
        toast.success("Alarm updated successfully!")
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/alarms")
      }, 1500)

    } catch (err) {
      console.error('Error saving alarm:', err)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render until mounted on client side
  if (!isMounted) {
    return null
  }

  // Redirect to login if not authenticated
  if (user.isLoggedIn !== "true") {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{isNew ? "New Alarm" : "Edit Alarm"}</h1>
        </div>



        <div className="space-y-6">
          {/* Alarm Name */}
          <Card>
            <CardContent className="p-4">
              <Label htmlFor="alarm-name">Alarm Name</Label>
              <Input
                id="alarm-name"
                value={alarmName}
                onChange={(e) => setAlarmName(e.target.value)}
                placeholder="Enter alarm name"
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Start Time */}
          <Card className="gap-0">
            <CardHeader className="">
              <CardTitle className="text-lg">Start Time</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex flex-col gap-2 items-center">
                <HourMinuteSelection
                  hour={startTime.hour}
                  minutes={startTime.minutes}
                  timeFormat={timeFormat}
                  onHourChange={(hour) => setStartTime({ ...startTime, hour })}
                  onMinutesChange={(minutes) => setStartTime({ ...startTime, minutes })}
                />
              <Select value={timeFormat} onValueChange={(value: "12h" | "24h") => setTimeFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour Format</SelectItem>
                  <SelectItem value="24h">24 Hour Format</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Days Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Repeat Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {DAY_OPTIONS.map((day) => (
                  <Button
                    key={day.value}
                    variant={selectedDays.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day.value)}
                    className="h-10 w-10 p-0 text-xs"
                  >
                    {day.shortLabel}
                  </Button>
                ))}
              </div>
              {selectedDays.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  No days selected - alarm will only ring once
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stop Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Stop Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={stopMethod} onValueChange={setStopMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOP_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>


          {/* Repeat Mode */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Repeat Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={repeatMode}
                onValueChange={(value: "simple" | "volume" | "custom") => setRepeatMode(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Repeats N times, every N minutes</SelectItem>
                  <SelectItem value="volume">Repeats N times, every N minutes, but gets N% louder</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              {repeatMode === "simple" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="repeat-times">Repeat Times</Label>
                    <Input
                      id="repeat-times"
                      type="number"
                      value={repeatTimes}
                      onChange={(e) => setRepeatTimes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="repeat-interval">Interval (minutes)</Label>
                    <Input
                      id="repeat-interval"
                      type="number"
                      value={repeatInterval}
                      onChange={(e) => setRepeatInterval(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {repeatMode === "volume" && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="repeat-times-vol">Repeat Times</Label>
                    <Input
                      id="repeat-times-vol"
                      type="number"
                      value={repeatTimes}
                      onChange={(e) => setRepeatTimes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="repeat-interval-vol">Interval (min)</Label>
                    <Input
                      id="repeat-interval-vol"
                      type="number"
                      value={repeatInterval}
                      onChange={(e) => setRepeatInterval(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="volume-increase">Volume +%</Label>
                    <Input
                      id="volume-increase"
                      type="number"
                      value={volumeIncrease}
                      onChange={(e) => setVolumeIncrease(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {repeatMode === "custom" && (
                <div className="space-y-4">
                  {customSteps.map((step, index) => (
                    <Card key={step.id} className="border-2 border-dashed">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Step {index + 1}</span>
                          {customSteps.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => removeCustomStep(step.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <div>
                            <Label className="text-xs">Song</Label>
                            <Select
                              value={step.song}
                              onValueChange={(value) => updateCustomStep(step.id, "song", value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Default Alarm">Default Alarm</SelectItem>
                                <SelectItem value="Gentle Wake">Gentle Wake</SelectItem>
                                <SelectItem value="Rooster Call">Rooster Call</SelectItem>
                                <SelectItem value="Phone from device">📱 From Device</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs">Volume</Label>
                            <div className="mt-1">
                              <Slider
                                value={[step.volume]}
                                onValueChange={(value) => updateCustomStep(step.id, "volume", value[0])}
                                min={10}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                              <div className="text-xs text-center mt-1">{step.volume}%</div>
                            </div>
                          </div>

                            <Label className="text-xs">Time</Label>
                          <div className="self-center">
                              <HourMinuteSelection
                                hour={step.hour}
                                minutes={step.minutes}
                                timeFormat={timeFormat}
                                onHourChange={(hour) => updateCustomStep(step.id, "hour", hour)}
                                onMinutesChange={(minutes) => updateCustomStep(step.id, "minutes", minutes)}
                                className="scale-75 self-center"
                              />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button variant="outline" onClick={addCustomStep} className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isNew ? "Creating..." : "Updating..."}
                </>
              ) : (
                `Save ${isNew ? "Alarm" : "Changes"}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
