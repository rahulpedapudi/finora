import { useLocation } from "react-router-dom"
import { Bell } from "lucide-react"
import { useAuthStore } from "@/features/auth/store/authStore"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/analytics": "Analytics",
  "/budgets": "Budgets",
  "/settings": "Settings",
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function TopNav() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const title = pageTitles[location.pathname] ?? "Finora"

  const isDashboard = location.pathname === "/dashboard"

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
      <div>
        {isDashboard ? (
          <p className="text-sm font-medium text-foreground">
            {getGreeting()},{" "}
            <span className="text-blue-400">{user?.name ?? "there"}</span>
          </p>
        ) : (
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-400">
          {user?.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "U"}
        </div>
      </div>
    </header>
  )
}
