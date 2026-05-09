import { useEffect, useState } from "react"
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus } from "lucide-react"
import { useTransactionState } from "@/features/transactions/store/transactionState"
import { useCategoryState } from "@/features/categories/store/catergoryState"
import SummaryCard from "@/components/dashboard/SummaryCard"
import SpendingChart from "@/components/dashboard/SpendingChart"
import BudgetProgress from "@/components/dashboard/BudgetProgress"
import RecentTransactions from "@/components/dashboard/RecentTransactions"
import AddTransactionModal from "@/components/transactions/AddTransactionModal"
import { Button } from "@/components/ui/button"

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false)

  const { data: transactions, fetchTransactions } = useTransactionState()
  const { fetchCategories } = useCategoryState()

  useEffect(() => {
    fetchTransactions()
    fetchCategories("/category")
  }, [])

  // Compute monthly stats
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const monthlyTxns = transactions.filter((t) => {
    const d = new Date(t.date || t.created_at)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  })

  const monthlyIncome = monthlyTxns
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthlyExpenses = monthlyTxns
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalBalance = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) -
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0)

  const savings = monthlyIncome - monthlyExpenses

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <SummaryCard
          label="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={<Wallet className="w-4 h-4" />}
          accentClass="bg-blue-500/10 text-blue-400"
        />
        <SummaryCard
          label="Monthly Income"
          value={formatCurrency(monthlyIncome)}
          icon={<TrendingUp className="w-4 h-4" />}
          accentClass="bg-green-500/10 text-green-400"
        />
        <SummaryCard
          label="Monthly Expenses"
          value={formatCurrency(monthlyExpenses)}
          icon={<TrendingDown className="w-4 h-4" />}
          accentClass="bg-red-500/10 text-red-400"
        />
        <SummaryCard
          label="Savings"
          value={formatCurrency(savings)}
          icon={<PiggyBank className="w-4 h-4" />}
          accentClass={
            savings >= 0
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }
        />
      </div>

      {/* Chart + Budget row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <SpendingChart />
        </div>
        <div className="lg:col-span-2">
          <BudgetProgress />
        </div>
      </div>

      {/* Recent transactions + Quick add */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>

        {/* Quick add panel */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center gap-4 text-center min-h-40">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Add Transaction
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Log income or expenses quickly
            </p>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
          >
            + New Transaction
          </Button>
        </div>
      </div>

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
