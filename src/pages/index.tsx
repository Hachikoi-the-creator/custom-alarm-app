import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUserStore } from '../context/user-context'

export default function HomePage() {
  const { user } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and has a valid ID
    if (!user.id || user.isLoggedIn !== "true") {
      router.push('/login')
    }
  }, [user.id, user.isLoggedIn])

  // Show loading while checking authentication
  if (!user.id || user.isLoggedIn !== "true") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">AlarmClock</h1>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }
return router.push('/alarms')
  }
