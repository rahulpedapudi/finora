import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase automatically exchanges the code/hash in the URL for a session.
    // We just need to wait for the session to be established, then redirect.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard", { replace: true })
      } else {
        navigate("/login", { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-[#2BBE4E]" />
        <span className="text-sm text-muted-foreground">
          Completing sign in...
        </span>
      </div>
    </div>
  )
}
