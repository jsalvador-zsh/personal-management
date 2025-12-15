import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/types"

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const supabase = createClient()

        // Get authenticated user
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authError) throw authError
        if (!authData.user) {
          setUser(null)
          setLoading(false)
          return
        }

        // Get user profile from public.users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single()

        if (userError) throw userError

        setUser(userData)
      } catch (err: any) {
        console.error("Error fetching current user:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  return { user, loading, error, isAdmin: user?.role === "admin" }
}
