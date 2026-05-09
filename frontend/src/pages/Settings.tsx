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
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Profile */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Profile
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-lg font-bold text-blue-400 shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{user?.name ?? "User"}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{user?.email ?? "—"}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Full name</span>
            </div>
            <span className="text-sm text-muted-foreground">{user?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Email</span>
            </div>
            <span className="text-sm text-muted-foreground">{user?.email ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Sun className="w-4 h-4 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground capitalize">{theme} mode</p>
            </div>
          </div>
          <div className="flex gap-1 p-1 bg-background border border-border rounded-lg">
            {(["dark", "light", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  theme === t ? "bg-blue-500 text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Notifications
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-foreground">Budget alerts</p>
              <p className="text-xs text-muted-foreground">Notify when 80% of budget is reached</p>
            </div>
          </div>
          <div className="w-9 h-5 bg-blue-500 rounded-full relative cursor-pointer opacity-50">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-red-500/20 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-4">
          Account
        </h3>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out of Finora
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground/50 pb-4">
        finora · v0.1.0
      </p>
    </div>
  )
}
