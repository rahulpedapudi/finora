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
    let mounted = true
    let subscription: { unsubscribe: () => void } | null = null

    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session && mounted) {
          try {
            const res = await api.get("/auth/me")
            if (mounted) {
              setUser(res.data)
            }
          } catch (error) {
            console.error("AuthLoader: failed to fetch profile on mount", error)
            if (mounted) {
              setUser(null)
            }
          }
        } else if (mounted) {
          setUser(null)
        }
      } catch (error) {
        console.error("AuthLoader: getSession failed on mount", error)
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }

      // 2. Listen for subsequent auth state changes (login, logout, token refresh)
      if (mounted) {
        const {
          data: { subscription: sub },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          // Ignore the initial session event since we already handled it on mount
          if (event === "INITIAL_SESSION") return

          if (session) {
            try {
              const res = await api.get("/auth/me")
              if (mounted) {
                setUser(res.data)
              }
            } catch (error) {
              console.error("AuthLoader: onAuthStateChange get profile failed", error)
              if (mounted) {
                setUser(null)
              }
            }
          } else if (mounted) {
            setUser(null)
          }
        })
        subscription = sub
      }
    }

    initAuth()

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
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
