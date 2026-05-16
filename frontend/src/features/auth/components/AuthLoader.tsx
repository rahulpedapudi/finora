import React, { useEffect, useState } from "react"
import { getCurrentUser } from "../api/getCurrentUser"
import { useAuthStore } from "../store/authStore"

export default function AuthLoader({
  children,
}: {
  children: React.ReactNode
}) {
  const setUser = useAuthStore((state) => state.setUser)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser()
        setUser(user)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

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
