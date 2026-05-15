import { useEffect } from "react"
import { useTransactionState } from "@/features/transactions/store/transactionState"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const MOCK_CATEGORY_DATA = [
  { name: "Food & Dining", amount: 4200, color: "bg-zinc-900 dark:bg-zinc-100", pct: 35 },
  { name: "Transport", amount: 1800, color: "bg-[#9CF0B6] dark:bg-[#9CF0B6]/80", pct: 15 },
  { name: "Shopping", amount: 3100, color: "bg-[#2BBE4E]", pct: 26 },
  { name: "Utilities", amount: 1900, color: "bg-[#71CF8A] dark:bg-[#71CF8A]/80", pct: 16 },
  { name: "Entertainment", amount: 900, color: "bg-[#C4F3D3] dark:bg-[#C4F3D3]/80", pct: 8 },
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border flex flex-col justify-center">
          <p className="text-xs font-semibold text-muted-foreground">6-mo Income</p>
          <p className="text-2xl font-bold text-[#2BBE4E] mt-1">
            ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border flex flex-col justify-center">
          <p className="text-xs font-semibold text-muted-foreground">6-mo Expenses</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            ${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border flex flex-col justify-center">
          <p className="text-xs font-semibold text-muted-foreground">Avg Monthly</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            ${Math.round(avgMonthly).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-semibold text-foreground">
            Monthly Overview
          </h3>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              Expenses
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2BBE4E]" />
              Income
            </span>
          </div>
        </div>
        <div className="flex items-end gap-2 sm:gap-4 h-48">
          {monthlyData.map(({ label, spend, income }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full max-w-[40px] flex items-end justify-center gap-1 sm:gap-2 h-36">
                {/* Expense bar */}
                <div className="flex-1 flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-zinc-900 dark:bg-zinc-100 rounded-t-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    style={{ height: `${(spend / maxVal) * 100}%` }}
                    title={`$${spend.toLocaleString("en-US")}`}
                  />
                </div>
                {/* Income bar */}
                <div className="flex-1 flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-[#2BBE4E] rounded-t-md hover:bg-[#25A243] transition-colors"
                    style={{ height: `${(income / maxVal) * 100}%` }}
                    title={`$${income.toLocaleString("en-US")}`}
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-foreground">
            Spending by Category
          </h3>
          <span className="text-xs font-medium text-muted-foreground">This month · est.</span>
        </div>
        <div className="space-y-5">
          {MOCK_CATEGORY_DATA.map(({ name, amount, color, pct }) => (
            <div key={name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm font-semibold text-foreground">
                    {name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
                  <span className="text-sm font-bold text-foreground w-20 text-right">
                    ${amount.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-medium text-muted-foreground mt-6 text-center">
          * Category breakdown is estimated. Connect analytics API for live data.
        </p>
      </div>
    </div>
  )
}
