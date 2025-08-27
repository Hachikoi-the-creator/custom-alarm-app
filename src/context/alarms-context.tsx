import { create } from 'zustand'

// Base alarm method interface
export  type BaseAlarmMethod = {
  id: string
  type: 'repeat' | 'repeat_with_volume' | 'custom'
}

// Method 1: Repeats song X every N minutes
export type RepeatAlarmMethod = BaseAlarmMethod & {
  type: 'repeat'
  song: string
  interval_minutes: number
}

// Method 2: Repeats song X every N minutes with volume increment
export type RepeatWithVolumeAlarmMethod = BaseAlarmMethod & {
  type: 'repeat_with_volume'
  song: string
  interval_minutes: number
  volume_increment: number
}

// Method 3: Custom time-based alarm
export type CustomAlarmMethod = {
  id: string
  type: 'custom'
  hour: number
  minute: number
  volume: number
  song: string
}

// Union type for all alarm methods
export type AlarmMethod = RepeatAlarmMethod | RepeatWithVolumeAlarmMethod | CustomAlarmMethod

export type Alarm = {
  uuid: string
  name: string
  hour: number
  minutes: number
  is_active: boolean
  days_active: number[]
  alarm_methods: AlarmMethod[]
}

type AlarmStore = {
  alarms: Alarm[]
  addAlarm: (alarm: Omit<Alarm, 'uuid'>) => void
  updateAlarm: (uuid: string, alarm: Alarm) => void
  deleteAlarm: (uuid: string) => void
  toggleAlarm: (uuid: string) => void
}

export const useAlarmStore = create<AlarmStore>((set) => ({
  alarms: [
  ],

  addAlarm: (alarm) => set((state) => ({
    alarms: [...state.alarms, { ...alarm, uuid: Date.now().toString() }]
  })),

  updateAlarm: (uuid, updatedAlarm) => set((state) => ({
    alarms: state.alarms.map((alarm) => 
      alarm.uuid === uuid ? { ...alarm, ...updatedAlarm } : alarm
    )
  })),

  deleteAlarm: (uuid) => set((state) => ({
    alarms: state.alarms.filter((alarm) => alarm.uuid !== uuid)
  })),

  toggleAlarm: (uuid) => set((state) => ({
    alarms: state.alarms.map((alarm) =>
      alarm.uuid === uuid ? { ...alarm, is_active: !alarm.is_active } : alarm
    )
  }))
}))