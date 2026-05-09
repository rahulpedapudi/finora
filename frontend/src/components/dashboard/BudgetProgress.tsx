import { Progress } from "@/components/ui/progress"

const MOCK_BUDGETS = [
  { category: "Food & Dining", spent: 4200, limit: 6000, icon: "🍔" },
  { category: "Transport", spent: 1800, limit: 2500, icon: "🚗" },
  { category: "Entertainment", spent: 900, limit: 1500, icon: "🎬" },
  { category: "Shopping", spent: 3100, limit: 4000, icon: "🛍" },
]

export default function BudgetProgress() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-foreground">
          Budget Overview
        </h3>
        <span className="text-xs text-muted-foreground">This month</span>
      </div>

      <div className="space-y-4">
        {MOCK_BUDGETS.map(({ category, spent, limit, icon }) => {
          const pct = Math.min(Math.round((spent / limit) * 100), 100)
          const isOver = spent >= limit * 0.85
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{icon}</span>
                  <span className="text-xs font-medium text-foreground">
                    {category}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold ${
                      isOver ? "text-red-400" : "text-muted-foreground"
                    }`}
                  >
                    ₹{spent.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {" "}/ ₹{limit.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="relative">
                <Progress value={pct} className="h-1.5" />
                {isOver && (
                  <div
                    className="absolute inset-0 h-1.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 60%, rgba(239,68,68,0.4) 100%)",
                      width: `${pct}%`,
                    }}
                  />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {pct}% used
                {isOver && (
                  <span className="text-red-400 ml-1">· Near limit</span>
                )}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
