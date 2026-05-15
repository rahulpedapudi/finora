import React, { useState } from "react"
import { register } from "../api/register"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await register({ name, email, password })
      navigate("/login")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top,#fff7f0_0%,#ffffff_50%,#f1f9ff_100%)] relative min-h-screen dark:bg-[radial-gradient(circle_at_top,#0c121f_0%,#070b13_55%,#05080d_100%)]">
      <div className="pointer-events-none absolute top-16 -left-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,#ffd7b8_0%,transparent_70%)] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-64 w-64 rounded-full bg-[conic-gradient(from_200deg,#a6e2ff,#e4f6ff,#bfe4ff)] opacity-50 blur-2xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center px-6 py-14">
        <div className="w-full rounded-3xl border border-border bg-card/75 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">
                Create account
              </p>
              <h1 className="text-3xl">Start your Finora journey</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
          </div>

          <form
            onSubmit={handleRegister}
            className="mt-8 grid gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <Label>Full name</Label>
              <Input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 md:col-span-2">
              <Button type="submit" size="lg">
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-xs text-muted-foreground">
                By creating an account you agree to our terms and privacy
                policy.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
