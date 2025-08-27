import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

interface CustomAlarmStep {
  id: string
  song: string
  volume: number
  hour: string
  minutes: string
}
type Props = {
    params: {
        id: string
    }
}
export default function EditAlarmPage({ params }: Props) {
  const router = useRouter()
  const isNew = params.id === "new"

  const [alarmName, setAlarmName] = useState("")
  const [startTime, setStartTime] = useState({ hour: "07", minutes: "00" })
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h")
  const [repeatMode, setRepeatMode] = useState<"simple" | "volume" | "custom">("simple")
  const [repeatTimes, setRepeatTimes] = useState("3")
  const [repeatInterval, setRepeatInterval] = useState("5")
  const [volumeIncrease, setVolumeIncrease] = useState("20")
  const [customSteps, setCustomSteps] = useState<CustomAlarmStep[]>([
    { id: "1", song: "Default Alarm", volume: 50, hour: "07", minutes: "00" },
  ])

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

  const handleSave = () => {
    // Save alarm logic here
    router.push("/alarms")
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Start Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatTime(startTime.hour, startTime.minutes)}
                </div>
                <div className="flex gap-2 justify-center">
                  <Input
                    type="number"
                    min="0"
                    max={timeFormat === "12h" ? "12" : "23"}
                    value={startTime.hour}
                    onChange={(e) => setStartTime({ ...startTime, hour: e.target.value.padStart(2, "0") })}
                    className="w-16 text-center"
                  />
                  <span className="self-center">:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={startTime.minutes}
                    onChange={(e) => setStartTime({ ...startTime, minutes: e.target.value.padStart(2, "0") })}
                    className="w-16 text-center"
                  />
                </div>
              </div>
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

                        <div className="grid grid-cols-3 gap-3">
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

                          <div>
                            <Label className="text-xs">Time</Label>
                            <div className="flex gap-1 mt-1">
                              <Input
                                type="number"
                                min="0"
                                max={timeFormat === "12h" ? "12" : "23"}
                                value={step.hour}
                                onChange={(e) => updateCustomStep(step.id, "hour", e.target.value.padStart(2, "0"))}
                                className="h-8 text-xs"
                              />
                              <Input
                                type="number"
                                min="0"
                                max="59"
                                value={step.minutes}
                                onChange={(e) => updateCustomStep(step.id, "minutes", e.target.value.padStart(2, "0"))}
                                className="h-8 text-xs"
                              />
                            </div>
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
            <Button variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Alarm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
