import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useTheme } from "@/components/theme-provider"
import { logout } from "@/features/auth/api/logout"
import { Separator } from "@/components/ui/separator"
import { LogOut, Moon, Sun, User, Shield, Bell } from "lucide-react"

export default function Settings() {
  const user = useAuthStore((s) => s.user)
  const logoutStore = useAuthStore((s) => s.logout)
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logout() } catch {}
    logoutStore()
    navigate("/login")
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile */}
      <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6">
          Profile
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-xl font-bold text-white dark:text-zinc-900 shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{user?.name ?? "User"}</p>
            <p className="text-sm font-medium text-muted-foreground mt-0.5">{user?.email ?? "—"}</p>
          </div>
        </div>
        <Separator className="my-6 bg-border" />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Full name</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{user?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Email</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{user?.email ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6">
          Appearance
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Theme</p>
              <p className="text-xs font-medium text-muted-foreground capitalize">{theme} mode</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 p-1 bg-muted rounded-[20px] sm:rounded-full">
            {(["dark", "light", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
                  theme === t ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6">
          Notifications
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Budget alerts</p>
              <p className="text-xs font-medium text-muted-foreground">Notify when 80% of budget is reached</p>
            </div>
          </div>
          <div className="w-10 h-6 bg-[#2BBE4E] rounded-full relative cursor-pointer opacity-50 flex items-center shrink-0">
            <div className="absolute right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-red-500/20 rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-6">
          Account
        </h3>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm font-bold text-red-500 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out of Finora
        </button>
      </div>

      <p className="text-center text-xs font-medium text-muted-foreground pb-8">
        finora · v0.1.0
      </p>
    </div>
  )
}
