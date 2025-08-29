import { useUserStore } from "@/context/user-context"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function AlarmsLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUserStore()
    const router = useRouter()
useEffect(() => {
    if (!user.isLoggedIn && user.isLoggedIn !== "unknown") {
        router.push("/login")
    }
}, [user.id, user.isLoggedIn])

  return (
    <>
      {children}
    </>
  )
}