

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Bell, BellOff } from "lucide-react"
import Link from "next/link"

type Alarm = {
  id: string
  name: string
  time: string
  isActive: boolean
  days: string[]
  isWorkdays?: boolean
  isWeekends?: boolean
}

export default function AlarmsPage() {
  const router = useRouter()
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: "1",
      name: "Morning Workout",
      time: "6:30 AM",
      isActive: true,
      days: ["Mon", "Wed", "Fri"],
    },
    {
      id: "2",
      name: "Work Start",
      time: "8:00 AM",
      isActive: true,
      days: [],
      isWorkdays: true,
    },
    {
      id: "3",
      name: "Weekend Sleep In",
      time: "9:00 AM",
      isActive: false,
      days: [],
      isWeekends: true,
    },
  ])

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map((alarm) => (alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm)))
  }

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id))
  }

  const getDaysDisplay = (alarm: Alarm) => {
    if (alarm.isWorkdays) return "Workdays"
    if (alarm.isWeekends) return "Weekends"
    return alarm.days.join(", ")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Alarms</h1>
          <Link href="/alarms/new" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {alarms.map((alarm) => (
            <Card key={alarm.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {alarm.isActive ? (
                          <Bell className="h-4 w-4 text-primary" />
                        ) : (
                          <BellOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <h3 className="font-semibold text-card-foreground">{alarm.name}</h3>
                      </div>
                      <Switch checked={alarm.isActive} onCheckedChange={() => toggleAlarm(alarm.id)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{alarm.time}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/alarms/edit/${alarm.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteAlarm(alarm.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {getDaysDisplay(alarm)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {alarms.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No alarms yet</h3>
            <p className="text-muted-foreground mb-4">Create your first alarm to get started</p>
            <Button onClick={() => router.push("/alarms/edit/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Alarm
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
