import { create } from 'zustand'

type Alarm = {
  id: string
  name: string
  time: string
  isActive: boolean
  days: string[]
  isWorkdays?: boolean
  isWeekends?: boolean
}

type AlarmStore = {
  alarms: Alarm[]
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void
  updateAlarm: (id: string, alarm: Alarm) => void
  deleteAlarm: (id: string) => void
  toggleAlarm: (id: string) => void
}

export const useAlarmStore = create<AlarmStore>((set) => ({
  alarms: [
    {
      id: '1',
      name: 'Morning Workout',
      time: '6:30 AM', 
      isActive: true,
      days: ['Mon', 'Wed', 'Fri']
    },
    {
      id: '2',
      name: 'Work Start',
      time: '8:00 AM',
      isActive: true,
      days: [],
      isWorkdays: true
    },
    {
      id: '3', 
      name: 'Weekend Sleep In',
      time: '9:00 AM',
      isActive: false,
      days: [],
      isWeekends: true
    }
  ],

  addAlarm: (alarm) => set((state) => ({
    alarms: [...state.alarms, { ...alarm, id: Date.now().toString() }]
  })),

  updateAlarm: (id, updatedAlarm) => set((state) => ({
    alarms: state.alarms.map((alarm) => 
      alarm.id === id ? { ...alarm, ...updatedAlarm } : alarm
    )
  })),

  deleteAlarm: (id) => set((state) => ({
    alarms: state.alarms.filter((alarm) => alarm.id !== id)
  })),

  toggleAlarm: (id) => set((state) => ({
    alarms: state.alarms.map((alarm) =>
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    )
  }))
}))