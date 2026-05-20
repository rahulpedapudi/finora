import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  // Target,
  Settings,
  LogOut,
  // CreditCard,
  // Lightbulb,
  // HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  // DollarSign,
} from "lucide-react"
import { useAuthStore } from "@/features/auth/store/authStore"
import { supabase } from "@/lib/supabase/client"

const menuGroups = [
  {
    title: "MAIN",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
      { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
      { to: "/analytics", icon: BarChart2, label: "Analytics" },
    ],
  },
  // {
  //   title: "INTELLIGENCE",
  //   items: [{ to: "/insights", icon: Lightbulb, label: "Smart Insights" }],
  // },
  // {
  //   title: "MONEY CONTROL",
  //   items: [{ to: "/budgets", icon: Target, label: "Goals" }],
  // },
  {
    title: "OTHERS",
    items: [
      { to: "/settings", icon: Settings, label: "Settings" },
      // { to: "/help", icon: HelpCircle, label: "Help" },
    ],
  },
]

export default function Sidebar() {
  const logoutStore = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    logoutStore()
    navigate("/login")
  }

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-border bg-background transition-all duration-300 ease-in-out lg:flex ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo & Toggle */}
      <div
        className={`flex items-center pt-8 pb-6 ${
          isCollapsed ? "justify-center px-0" : "gap-2.5 px-6"
        }`}
      >
        <div className="flex items-center justify-center">
          <div
            className={`flex items-center text-xl font-bold tracking-wide text-foreground ${
              isCollapsed ? "gap-0" : "gap-2"
            }`}
          >
            {!isCollapsed && <span className="font-extrabold">Finora</span>}
          </div>
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="ml-auto text-muted-foreground hover:text-foreground"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center pb-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-muted-foreground hover:text-foreground"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Nav links */}
      <nav
        className={`flex-1 space-y-6 overflow-y-auto py-2 ${isCollapsed ? "px-2" : "px-4"}`}
      >
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  title={isCollapsed ? label : undefined}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                      isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                    } ${
                      isActive ||
                      (to === "/dashboard" && window.location.pathname === "/")
                        ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 ${
                          isActive ||
                          (to === "/dashboard" &&
                            window.location.pathname === "/")
                            ? isCollapsed
                              ? "text-white dark:text-zinc-900"
                              : "text-[#2BBE4E]"
                            : "text-muted-foreground"
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{label}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Logout at bottom of others */}
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Log out" : undefined}
          className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground ${
            isCollapsed ? "justify-center px-0" : "gap-3 px-3"
          }`}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
          {!isCollapsed && <span className="truncate">Log out</span>}
        </button>
      </nav>

      {/* AI Assistant section */}
      {/* <div
        className={`mt-auto transition-all duration-300 ${isCollapsed ? "p-2" : "p-4"}`}
      >
        {isCollapsed ? (
          <button
            className="flex w-full justify-center rounded-2xl border border-border bg-card py-4 transition-colors hover:bg-muted"
            title="AI Assistant"
            onClick={() => setIsCollapsed(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EEF8F1] text-[#2BBE4E] dark:bg-[#2BBE4E]/20">
              <Sparkles className="h-4 w-4" />
            </div>
          </button>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#EEF8F1] text-[#2BBE4E] dark:bg-[#2BBE4E]/20">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="truncate text-sm font-semibold text-foreground">
                AI Assistant
              </span>
              <span className="ml-1 h-2 w-2 shrink-0 rounded-full bg-[#2BBE4E]"></span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Ask me anything finance..."
                className="w-full rounded-full border border-border bg-background py-2.5 pr-8 pl-3 text-xs text-foreground transition-colors outline-none focus:border-[#2BBE4E]"
              />
              <button
                title="send"
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-[#2BBE4E]"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-3 no-scrollbar flex gap-2 overflow-x-auto pb-1">
              <span className="cursor-pointer rounded-full border border-border bg-background px-2 py-1 text-[10px] whitespace-nowrap text-muted-foreground transition-colors hover:border-foreground">
                Spending tips
              </span>
              <span className="cursor-pointer rounded-full border border-border bg-background px-2 py-1 text-[10px] whitespace-nowrap text-muted-foreground transition-colors hover:border-foreground">
                Budget help
              </span>
            </div>
          </div>
        )}
      </div> */}
    </aside>
  )
}
