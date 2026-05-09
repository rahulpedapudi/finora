import { TrendingUp, TrendingDown } from "lucide-react"

interface TransactionItemProps {
  id: string
  raw_input: string
  merchant?: string
  amount: number
  type: "income" | "expense"
  date: string
  created_at: string
  onDelete?: (id: string) => void
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatAmount(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function TransactionItem({
  id,
  raw_input,
  merchant,
  amount,
  type,
  date,
  created_at,
  onDelete,
}: TransactionItemProps) {
  const displayName = merchant || raw_input || "Transaction"

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/4 transition-colors group">
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          type === "income" ? "bg-green-500/10" : "bg-red-500/10"
        }`}
      >
        {type === "income" ? (
          <TrendingUp className="w-4 h-4 text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate capitalize">
          {displayName}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDate(date || created_at)}
        </p>
      </div>

      {/* Type badge */}
      <span
        className={`hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          type === "income"
            ? "bg-green-500/10 text-green-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        {type}
      </span>

      {/* Amount */}
      <span
        className={`text-sm font-semibold shrink-0 ml-2 ${
          type === "income" ? "text-green-400" : "text-red-400"
        }`}
      >
        {type === "income" ? "+" : "-"}
        {formatAmount(amount)}
      </span>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 ml-1 text-xs px-2 py-1 rounded"
          title="Delete transaction"
        >
          ✕
        </button>
      )}
    </div>
  )
}
