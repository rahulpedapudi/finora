import React, { useState } from "react"
import { login } from "../api/login"
import { useAuthStore } from "../store/authStore"
import { getCurrentUser } from "../api/getCurrentUser"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      const user = await getCurrentUser()
      setUser(user)
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#eef4ff_0%,#ffffff_45%,#f4fbff_100%)] dark:bg-[radial-gradient(circle_at_top,#0a1230_0%,#050914_55%,#03060b_100%)]">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[conic-gradient(from_180deg,#8ea7ff,#d4e2ff,#b8c7ff)] opacity-40 blur-3xl" />
      <div className="bg-[radial-gradient(circle,#b6f0ff_0%,#e8fbff_55%,transparent_70%)]opacity-60 pointer-events-none absolute right-0 -bottom-24 h-80 w-80 rounded-full blur-2xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden rounded-3xl border border-white/40 bg-white/60 p-10 shadow-xl backdrop-blur-md md:flex md:flex-col md:justify-between dark:border-white/10 dark:bg-white/5">
            <div>
              <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">
                Finora
              </p>
              <h2 className="mt-4 text-4xl">
                Welcome back to your financial calm.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Stay on top of budgets, payments, and goals with a single
                elegant view.
              </p>
            </div>
            <div className="mt-10 space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Smart categorization
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Automated weekly insights
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Real-time budget alerts
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/70 p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <h1 className="text-2xl font-semibold">Sign in to Finora</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/register")}
              >
                Create account
              </Button>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
              Secure sessions, encrypted storage, and easy exports. You are
              always in control.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
