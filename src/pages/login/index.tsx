import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff } from "lucide-react"

import { useUserStore } from "@/context/user-context"
import { sha256 } from "js-sha256"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { setUser } = useUserStore()

  // Password hashing function using API route
  const hashPassword = async (plainPassword: string) => {
    try {
      const hashedPassword = sha256(plainPassword);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error)
      throw error
    }
  
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Step 1: Get all users from the custom_users table
      const { data: users, error: usersError } = await supabase
        .from("custom_users")
        .select("id, username, password_hash")

      if (usersError) {
        console.error('Error fetching users:', usersError)
        setError("Failed to connect to database")
        return
      }

      if (!users || users.length === 0) {
        setError("No users found in database")
        return
      }

      // Step 2: Check if username exists
      const user = users.find(u => u.username === username)
      if (!user) {
        setError("Username not found")
        return
      }

      // Step 3: Compare the hashed 
      const isPasswordValid = sha256(password) === user.password_hash
      
      if (!isPasswordValid) {
        setError("Failed to verify password")
        return
      }
      
      if (isPasswordValid) {
        setSuccess("Login successful! Redirecting...")
        
        // Update last_login timestamp
        await supabase
          .from("custom_users")
          .update({ last_login: new Date().toISOString() })
          .eq("id", user.id)

        // Update user context
        setUser({
          id: user.id,
          username: user.username,
          passwordHash: user.password_hash,
          isLoggedIn: "true"
        })

        // Redirect to alarms page after a short delay
        setTimeout(() => {
          router.push("/alarms")
        }, 500)
      } else {
        setError("Invalid password")
      }

    } catch (error) {
      console.error('Login error:', error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async () => {
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Check if username already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from("custom_users")
        .select("username")
        .eq("username", username)

      if (checkError) {
        console.error('Error checking username:', checkError)
        setError("Failed to check username availability")
        return
      }

      if (existingUsers && existingUsers.length > 0) {
        setError("Username already exists")
        return
      }

      // Hash the password
      const hashedPassword = await hashPassword(password)

      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from("custom_users")
        .insert([
          {
            username: username,
            password_hash: hashedPassword
          }
        ])
        .select()

      if (createError) {
        console.error('Error creating user:', createError)
        setError("Failed to create account")
        return
      }

      if (newUser && newUser[0]) {
        setSuccess("Account created successfully! Logging you in...")
        
        // Update user context - automatically log in the new user
        setUser({
          id: newUser[0].id,
          username: newUser[0].username,
          passwordHash: hashedPassword,
          isLoggedIn: "true"
        })

        // Update last_login timestamp
        await supabase
          .from("custom_users")
          .update({ last_login: new Date().toISOString() })
          .eq("id", newUser[0].id)

        // Redirect to alarms page after a short delay
        setTimeout(() => {
          router.push("/alarms")
        }, 1500)
      }

    } catch (error) {
      console.error('Create account error:', error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">AlarmClock</CardTitle>
          <CardDescription>Enter your credentials to sign in or create a new account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Error and Success Messages */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-100 border border-green-300 rounded-md">
                <span className="text-green-800 text-sm">{success}</span>
              </div>
            )}

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                disabled={isLoading}
                onClick={handleCreateAccount}
              >
                {isLoading ? "Creating..." : "Create New Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
