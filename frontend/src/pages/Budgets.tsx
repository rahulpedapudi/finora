import { Target, Plus } from "lucide-react"

const MOCK_BUDGETS = [
  { category: "Food & Dining", icon: "🍔", spent: 4200, limit: 6000, color: "bg-zinc-900 dark:bg-zinc-100" },
  { category: "Transport", icon: "🚗", spent: 1800, limit: 2500, color: "bg-[#9CF0B6] dark:bg-[#9CF0B6]/80" },
  { category: "Entertainment", icon: "🎬", spent: 900, limit: 1500, color: "bg-[#2BBE4E]" },
  { category: "Shopping", icon: "🛍", spent: 3100, limit: 4000, color: "bg-[#71CF8A] dark:bg-[#71CF8A]/80" },
  { category: "Utilities", icon: "💡", spent: 1900, limit: 2000, color: "bg-[#C4F3D3] dark:bg-[#C4F3D3]/80" },
]

export default function Budgets() {
  const totalBudget = MOCK_BUDGETS.reduce((s, b) => s + b.limit, 0)
  const totalSpent = MOCK_BUDGETS.reduce((s, b) => s + b.spent, 0)
  const overallPct = Math.min(Math.round((totalSpent / totalBudget) * 100), 100)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview */}
      <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Monthly Budget</h3>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">May 2026</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">of ${totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        
        {/* Custom Progress Bar */}
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
           <div className="h-full bg-[#2BBE4E] rounded-full transition-all duration-500" style={{ width: `${overallPct}%` }}></div>
        </div>

        <p className="text-xs font-semibold text-muted-foreground mt-4">
          {overallPct}% used ·{" "}
          <span className="text-[#2BBE4E]">${(totalBudget - totalSpent).toLocaleString("en-US", { minimumFractionDigits: 2 })} remaining</span>
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
            <div key={category} className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border flex flex-col justify-between space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl shrink-0">
                    {icon}
                  </div>
                  <span className="text-sm font-bold text-foreground">{category}</span>
                </div>
                {isOver && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">OVER</span>}
                {isWarning && !isOver && <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">WARN</span>}
              </div>

              <div>
                <div className="flex justify-between items-end text-xs mb-3">
                  <span className={`text-lg font-bold ${isOver ? "text-red-500" : "text-foreground"}`}>
                    ${spent.toLocaleString("en-US")}
                  </span>
                  <span className="text-muted-foreground font-medium pb-0.5">
                    ${limit.toLocaleString("en-US")}
                  </span>
                </div>
                
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isOver ? "bg-red-500" : isWarning ? "bg-orange-400" : color}`} 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">{pct}% used</span>
                <span className={`text-xs font-bold ${remaining < 0 ? "text-red-500" : "text-[#2BBE4E]"}`}>
                  {remaining < 0 ? "-" : "+"}${Math.abs(remaining).toLocaleString("en-US")} left
                </span>
              </div>
            </div>
          )
        })}

        <button className="bg-card border-2 border-dashed border-border rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 hover:border-[#2BBE4E] hover:bg-[#EEF8F1] dark:hover:bg-[#2BBE4E]/10 transition-colors min-h-[220px] group">
          <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-[#2BBE4E] flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors" />
          </div>
          <p className="text-sm font-bold text-muted-foreground group-hover:text-[#2BBE4E] transition-colors">Add Budget</p>
        </button>
      </div>

      <div className="bg-card border border-border rounded-[24px] p-6 flex items-start gap-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <Target className="w-4 h-4 text-blue-500" />
        </div>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          Budget management API is coming soon. Values shown are for preview purposes. Once connected, budgets will reflect your real spending data.
        </p>
      </div>
    </div>
  )
}
