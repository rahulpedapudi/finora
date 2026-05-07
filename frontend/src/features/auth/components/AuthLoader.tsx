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

  if (loading) return <h1>Loading....</h1>

  return children
}
