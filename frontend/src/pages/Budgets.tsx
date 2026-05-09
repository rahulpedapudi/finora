import { Progress } from "@/components/ui/progress"
import { Target, Plus } from "lucide-react"

const MOCK_BUDGETS = [
  { category: "Food & Dining", icon: "🍔", spent: 4200, limit: 6000, color: "bg-orange-400" },
  { category: "Transport", icon: "🚗", spent: 1800, limit: 2500, color: "bg-blue-400" },
  { category: "Entertainment", icon: "🎬", spent: 900, limit: 1500, color: "bg-purple-400" },
  { category: "Shopping", icon: "🛍", spent: 3100, limit: 4000, color: "bg-pink-400" },
  { category: "Utilities", icon: "💡", spent: 1900, limit: 2000, color: "bg-yellow-400" },
]

export default function Budgets() {
  const totalBudget = MOCK_BUDGETS.reduce((s, b) => s + b.limit, 0)
  const totalSpent = MOCK_BUDGETS.reduce((s, b) => s + b.spent, 0)
  const overallPct = Math.round((totalSpent / totalBudget) * 100)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Overview */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Monthly Budget</h3>
            <p className="text-xs text-muted-foreground mt-0.5">May 2026</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">₹{totalSpent.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground">of ₹{totalBudget.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <Progress value={overallPct} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {overallPct}% used ·{" "}
          <span className="text-green-400">₹{(totalBudget - totalSpent).toLocaleString("en-IN")} remaining</span>
        </p>
      </div>

      {/* Budget cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_BUDGETS.map(({ category, icon, spent, limit, color }) => {
          const pct = Math.min(Math.round((spent / limit) * 100), 100)
          const remaining = limit - spent
          const isWarning = pct >= 75
          const isOver = pct >= 100
          return (
            <div key={category} className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-medium text-foreground">{category}</span>
                </div>
                {isOver && <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">OVER</span>}
                {isWarning && !isOver && <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">WARN</span>}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className={`font-semibold ${isOver ? "text-red-400" : "text-foreground"}`}>₹{spent.toLocaleString("en-IN")}</span>
                  <span className="text-muted-foreground">₹{limit.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${isOver ? "bg-red-500" : isWarning ? "bg-yellow-400" : color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{pct}% used</span>
                <span className={`text-xs font-medium ${remaining < 0 ? "text-red-400" : "text-green-400"}`}>
                  {remaining < 0 ? "-" : "+"}₹{Math.abs(remaining).toLocaleString("en-IN")} left
                </span>
              </div>
            </div>
          )
        })}

        <button className="bg-card border border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors min-h-36 group">
          <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-blue-500/10 flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-blue-400 transition-colors" />
          </div>
          <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Add Budget</p>
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
        <Target className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Budget management API is coming soon. Values shown are for preview purposes. Once connected, budgets will reflect real spending data.
        </p>
      </div>
    </div>
  )
}
