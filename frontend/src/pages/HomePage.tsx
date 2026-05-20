import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#fdf8f3_0%,_#ffffff_45%,_#f2f7ff_100%)]dark:bg-[radial-gradient(circle_at_top,#0a0e1a_0%,#040812_55%,#02040a_100%)] relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute top-10 -left-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,#ffd9c7_0%,transparent_70%)] opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute right-20 bottom-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,#ffd9c7_0%,transparent_70%)] opacity-60 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase">
              Finora finance studio
            </p>
            <h1 className="text-4xl md:text-6xl">
              Your money, beautifully organized.
            </h1>
            <p className="text-lg text-muted-foreground">
              Track every transaction, plan budgets, and see trends with calm,
              confident clarity.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => navigate("/login")}>
                Get started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
              >
                View dashboard
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-2xl backdrop-blur-md">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                    Weekly overview
                  </p>
                  <h2 className="text-2xl font-semibold">$3,482.22</h2>
                  <p className="text-xs text-muted-foreground">
                    Total spend, last 7 days
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 font-semibold text-primary">
                  +8%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Dining</p>
                  <p className="text-lg font-semibold">$482</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Subscriptions</p>
                  <p className="text-lg font-semibold">$219</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Savings</p>
                  <p className="text-lg font-semibold">$1,120</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Bills</p>
                  <p className="text-lg font-semibold">$690</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-4">
                <p className="text-xs text-muted-foreground">Next insight</p>
                <p className="text-sm">
                  Your dining spending is down 12% this week. Keep it going.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
