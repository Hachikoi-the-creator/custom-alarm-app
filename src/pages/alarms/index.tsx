"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Bell, BellOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useUserStore } from "@/context/user-context"

// Updated Alarm type to match your database schema
type Alarm = {
  id: string
  user_id: string
  name: string
  hour: number
  minutes: number
  days_active: number[]
  is_active: boolean
  stop_method: string
  custom_snooze: any // JSONB field
  steps: any // JSON field
  snooze_duration_minutes: number
  snooze_max_count: number | null
  created_at: string
  updated_at: string
}

export default function AlarmsPage() {
  const router = useRouter()
  const { user } = useUserStore()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch alarms from Supabase
  const fetchAlarms = async () => {
    if (!user.id) {
      setError("User not authenticated")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const { data, error: fetchError } = await supabase
        .from("alarms")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error('Error fetching alarms:', fetchError)
        setError("Failed to load alarms")
        return
      }

      setAlarms(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Load alarms on component mount
  useEffect(() => {
    fetchAlarms()
  }, [user.id])

  // Toggle alarm active status
  const toggleAlarm = async (id: string, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from("alarms")
        .update({ is_active: !currentStatus })
        .eq("id", id)

      if (updateError) {
        console.error('Error updating alarm:', updateError)
        setError("Failed to update alarm")
        return
      }

      // Update local state
      setAlarms(alarms.map((alarm) => 
        alarm.id === id ? { ...alarm, is_active: !currentStatus } : alarm
      ))
    } catch (err) {
      console.error('Error toggling alarm:', err)
      setError("Failed to update alarm")
    }
  }

  // Delete alarm
  const deleteAlarm = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alarm?")) return

    try {
      const { error: deleteError } = await supabase
        .from("alarms")
        .delete()
        .eq("id", id)

      if (deleteError) {
        console.error('Error deleting alarm:', deleteError)
        setError("Failed to delete alarm")
        return
      }

      // Update local state
      setAlarms(alarms.filter((alarm) => alarm.id !== id))
    } catch (err) {
      console.error('Error deleting alarm:', err)
      setError("Failed to delete alarm")
    }
  }

  // Format time display
  const formatTime = (hour: number, minutes: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHour}:${displayMinutes} ${period}`
  }

  // Format days display
  const getDaysDisplay = (alarm: Alarm) => {
    if (!alarm.days_active || alarm.days_active.length === 0) {
      return "Once"
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const selectedDays = alarm.days_active.map(dayIndex => dayNames[dayIndex])
    
    if (selectedDays.length === 7) return "Every day"
    if (selectedDays.length === 5 && 
        selectedDays.includes('Mon') && selectedDays.includes('Tue') && 
        selectedDays.includes('Wed') && selectedDays.includes('Thu') && 
        selectedDays.includes('Fri')) return "Workdays"
    if (selectedDays.length === 2 && 
        selectedDays.includes('Sat') && selectedDays.includes('Sun')) return "Weekends"
    
    return selectedDays.join(", ")
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Loading alarms...</h3>
          </div>
        )}

        {/* Alarms List */}
        {!isLoading && (
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <Card key={alarm.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {alarm.is_active ? (
                            <Bell className="h-4 w-4 text-primary" />
                          ) : (
                            <BellOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <h3 className="font-semibold text-card-foreground">{alarm.name}</h3>
                        </div>
                        <Switch 
                          checked={alarm.is_active} 
                          onCheckedChange={() => toggleAlarm(alarm.id, alarm.is_active)} 
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {formatTime(alarm.hour, alarm.minutes)}
                        </span>
                        <div className="flex gap-2">
                          <Link href={`/alarms/edit/${alarm.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => deleteAlarm(alarm.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          {getDaysDisplay(alarm)}
                        </Badge>
                        <Badge variant="outline" className="text-xs ml-2">
                          {alarm.stop_method}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && alarms.length === 0 && (
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
