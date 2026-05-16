import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ArrowLeftRight,
  // BarChart2,
  // Target,
  Settings,
} from "lucide-react"

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  // { to: "/analytics", icon: BarChart2, label: "Analytics" },
  // { to: "/budgets", icon: Target, label: "Budgets" },
  { to: "/settings", icon: Settings, label: "Settings" },
]

export default function MobileNav() {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-border bg-sidebar px-2 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-colors duration-150 ${
                isActive ? "text-[#2BBE4E]" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
