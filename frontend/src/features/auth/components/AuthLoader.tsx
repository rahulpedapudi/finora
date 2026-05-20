import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuthStore } from "../store/authStore"
import { api } from "@/lib/axios"

export default function AuthLoader({
  children,
}: {
  children: React.ReactNode
}) {
  const setUser = useAuthStore((state) => state.setUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        try {
          const res = await api.get("/auth/me")
          setUser(res.data)
        } catch {
          setUser(null)
        }
      }
      setLoading(false)
    })

    // 2. Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        try {
          const res = await api.get("/auth/me")
          setUser(res.data)
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  if (loading)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-[#2BBE4E]" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    )

  return children
}
