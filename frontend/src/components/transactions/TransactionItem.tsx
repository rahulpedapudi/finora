import { TrendingUp, TrendingDown, Trash2 } from "lucide-react"

interface TransactionItemProps {
  id: string
  raw_input: string
  merchant?: string
  amount: number
  type: "income" | "expense"
  date?: string
  created_at: string
  onClick: () => void
  onDelete?: (id: string) => void
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
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
  onClick,
}: TransactionItemProps) {
  const displayName = merchant || raw_input || "Transaction"
  const isIncome = type === "income"

  return (
    <div
      onClick={() => onClick()}
      className="group relative flex cursor-pointer items-center justify-between rounded-[20px] border border-transparent p-3.5 transition-all duration-200 hover:border-border hover:bg-muted/80 hover:shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
            isIncome
              ? "bg-[#EEF8F1] text-[#2BBE4E] dark:bg-[#EEF8F1]/10"
              : "bg-red-50 text-red-500 dark:bg-red-500/10"
          }`}
        >
          {isIncome ? (
            <TrendingUp className="h-5 w-5" strokeWidth={2.5} />
          ) : (
            <TrendingDown className="h-5 w-5" strokeWidth={2.5} />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold tracking-tight text-foreground capitalize">
            {displayName}
          </p>
          <p className="mt-0.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            {formatTime(date || created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`text-base font-bold tracking-tight ${
            isIncome ? "text-[#2BBE4E]" : "text-foreground"
          }`}
        >
          {isIncome ? "+" : "-"}
          {amount}
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(id)
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-100 shadow-sm transition-all group-hover:opacity-100 hover:border-transparent hover:bg-red-500 hover:text-white sm:opacity-0"
            title="Delete transaction"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
