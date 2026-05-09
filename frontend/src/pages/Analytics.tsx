import { useEffect } from "react"
import { useTransactionState } from "@/features/transactions/store/transactionState"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const MOCK_CATEGORY_DATA = [
  { name: "Food & Dining", amount: 4200, color: "bg-orange-400", pct: 35 },
  { name: "Transport", amount: 1800, color: "bg-blue-400", pct: 15 },
  { name: "Shopping", amount: 3100, color: "bg-purple-400", pct: 26 },
  { name: "Entertainment", amount: 900, color: "bg-pink-400", pct: 8 },
  { name: "Utilities", amount: 1900, color: "bg-yellow-400", pct: 16 },
]

export default function Analytics() {
  const { data: transactions, fetchTransactions } = useTransactionState()

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Compute last 6 months spending from real data
  const now = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const month = d.getMonth()
    const year = d.getFullYear()
    const spend = transactions
      .filter((t) => {
        const td = new Date(t.date || t.created_at)
        return (
          t.type === "expense" &&
          td.getMonth() === month &&
          td.getFullYear() === year
        )
      })
      .reduce((s, t) => s + Number(t.amount), 0)
    const income = transactions
      .filter((t) => {
        const td = new Date(t.date || t.created_at)
        return (
          t.type === "income" &&
          td.getMonth() === month &&
          td.getFullYear() === year
        )
      })
      .reduce((s, t) => s + Number(t.amount), 0)
    return { label: MONTHS[month], spend, income }
  })

  const maxVal = Math.max(...monthlyData.flatMap((m) => [m.spend, m.income]), 1)

  const totalSpend = monthlyData.reduce((s, m) => s + m.spend, 0)
  const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0)
  const avgMonthly = totalSpend / 6

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl px-4 py-4">
          <p className="text-xs text-muted-foreground">6-mo Income</p>
          <p className="text-lg font-semibold text-green-400 mt-1">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-4">
          <p className="text-xs text-muted-foreground">6-mo Expenses</p>
          <p className="text-lg font-semibold text-red-400 mt-1">
            ₹{totalSpend.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-4">
          <p className="text-xs text-muted-foreground">Avg Monthly</p>
          <p className="text-lg font-semibold text-foreground mt-1">
            ₹{Math.round(avgMonthly).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-foreground">
            Monthly Overview
          </h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Expenses
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Income
            </span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {monthlyData.map(({ label, spend, income }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center gap-0.5 h-32">
                {/* Expense bar */}
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="w-full bg-blue-500/50 rounded-t-sm"
                    style={{ height: `${(spend / maxVal) * 100}%` }}
                    title={`₹${spend.toLocaleString("en-IN")}`}
                  />
                </div>
                {/* Income bar */}
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="w-full bg-green-500/50 rounded-t-sm"
                    style={{ height: `${(income / maxVal) * 100}%` }}
                    title={`₹${income.toLocaleString("en-IN")}`}
                  />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-foreground">
            Spending by Category
          </h3>
          <span className="text-xs text-muted-foreground">This month · est.</span>
        </div>
        <div className="space-y-4">
          {MOCK_CATEGORY_DATA.map(({ name, amount, color, pct }) => (
            <div key={name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-xs font-medium text-foreground">
                    {name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                  <span className="text-xs font-medium text-foreground w-20 text-right">
                    ₹{amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${pct}%`, opacity: 0.7 }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-4">
          * Category breakdown is estimated. Connect analytics API for live data.
        </p>
      </div>
    </div>
  )
}
