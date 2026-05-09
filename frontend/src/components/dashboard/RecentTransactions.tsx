import { useTransactionState } from "@/features/transactions/store/transactionState"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Link } from "react-router-dom"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

function formatAmount(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`
}

export default function RecentTransactions() {
  const transactions = useTransactionState((s) => s.data)
  const recent = [...transactions].reverse().slice(0, 5)

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Recent Transactions
        </h3>
        <Link
          to="/transactions"
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          View all
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground">No transactions yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Add your first transaction to get started
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {recent.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-white/4 transition-colors"
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  txn.type === "income"
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                }`}
              >
                {txn.type === "income" ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {txn.raw_input || txn.merchant || "Transaction"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(txn.date || txn.created_at)}
                </p>
              </div>

              {/* Amount */}
              <span
                className={`text-sm font-semibold shrink-0 ${
                  txn.type === "income" ? "text-green-400" : "text-red-400"
                }`}
              >
                {txn.type === "income" ? "+" : "-"}
                {formatAmount(Number(txn.amount))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
