import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type User = {
  id: string
  username: string
  passwordHash: string
  isLoggedIn: "unknown" | "true" | "false"
}

type UserStore = {
  user: User // Always an object, never null
  setUser: (user: User) => void
  clearUser: () => void
}

const EMPTY_USER: User = {
  id: "",
  username: "",
  passwordHash: "",
  isLoggedIn: "unknown"
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: EMPTY_USER,
      setUser: (user) => set({ user }), 
      clearUser: () => set({ user: EMPTY_USER })
    }),
    {
      name: 'user-storage'
    }
  )
)
