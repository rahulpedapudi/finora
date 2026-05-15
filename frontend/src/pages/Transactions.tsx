import { useEffect, useState } from "react"
import { Search, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useTransactions } from "@/features/transactions/hooks/useTransactions"
import TransactionItem from "@/components/transactions/TransactionItem"
import AddTransactionModal from "@/components/transactions/AddTransactionModal"
import TransactionDetailModal from "@/components/transactions/TransactionDetailModal"
import { formatter } from "@/lib/helpers"
import { Button } from "@/components/ui/button"

type FilterType = "all" | "income" | "expense"

export default function Transactions() {
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [transactionDetail, setTransactionDetail] = useState({})

  const {
    data,
    isLoading: loading,
    hasNextPage,
    fetchNextPage,
  } = useTransactions()

  const allTransactions = data?.pages.flatMap((page) => page.transactions) ?? []

  // Filter transactions based on search and type
  const filteredTransactions = allTransactions.filter((t) => {
    const matchesSearch = (t.title || t.merchant || "")
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesType = filter === "all" ? true : t.type === filter
    return matchesSearch && matchesType
  })

  // Sort descending
  const sortedTxns = [...filteredTransactions].sort((a, b) => {
    const dA = new Date(a.date_of_transaction || a.created_at || 0).getTime()
    const dB = new Date(b.date_of_transaction || b.created_at || 0).getTime()
    return dB - dA
  })

  // Group by date
  const groupedArray: { title: string; items: typeof allTransactions }[] = []
  let currentGroup: { title: string; items: typeof allTransactions } | null =
    null

  for (const txn of sortedTxns) {
    const d = new Date(txn.date_of_transaction || txn.created_at || new Date())
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const isToday = d.toDateString() === today.toDateString()
    const isYesterday = d.toDateString() === yesterday.toDateString()

    let groupKey = ""
    if (isToday) groupKey = "Today"
    else if (isYesterday) groupKey = "Yesterday"
    else {
      groupKey = d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: d.getFullYear() === today.getFullYear() ? undefined : "numeric",
      })
    }

    if (!currentGroup || currentGroup.title !== groupKey) {
      if (currentGroup) groupedArray.push(currentGroup)
      currentGroup = { title: groupKey, items: [] }
    }
    currentGroup.items.push(txn)
  }
  if (currentGroup) groupedArray.push(currentGroup)

  // Calculate totals from ALL transactions
  const totalIncome = allTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0)

  const totalExpenses = allTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0)

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading transactions...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Stats bar */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="relative flex flex-col justify-center overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <div className="pointer-events-none absolute -top-4 -right-4 text-foreground opacity-[0.03]">
            <Wallet className="h-32 w-32" />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-muted p-1.5">
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              Total Transactions
            </p>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {allTransactions.length}
          </p>
        </div>

        <div className="relative flex flex-col justify-center overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <div className="pointer-events-none absolute -top-4 -right-4 text-[#2BBE4E] opacity-[0.03]">
            <TrendingUp className="h-32 w-32" />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-[#EEF8F1] p-1.5 dark:bg-[#EEF8F1]/10">
              <TrendingUp className="h-4 w-4 text-[#2BBE4E]" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              Income
            </p>
          </div>
          <p className="text-3xl font-bold text-[#2BBE4E]">
            {formatter.format(totalIncome)}
          </p>
        </div>

        <div className="relative flex flex-col justify-center overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-sm">
          <div className="pointer-events-none absolute -top-4 -right-4 text-red-500 opacity-[0.03]">
            <TrendingDown className="h-32 w-32" />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-red-500/10 p-1.5">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              Expenses
            </p>
          </div>
          <p className="text-3xl font-bold text-red-500">
            {formatter.format(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex w-full rounded-full border border-border bg-card p-1 shadow-sm sm:w-auto">
          {(["all", "income", "expense"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-full px-6 py-2.5 text-xs font-bold capitalize transition-all duration-200 sm:flex-none ${
                filter === f
                  ? "scale-100 transform bg-zinc-900 text-white shadow-md dark:bg-zinc-100 dark:text-zinc-900"
                  : "scale-95 transform text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-border bg-card py-3 pr-4 pl-11 text-sm font-medium text-foreground shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-[#2BBE4E] focus:ring-1 focus:ring-[#2BBE4E]"
            />
          </div>
          <button
            type="button"
            title="Add Transaction"
            onClick={() => setModalOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2BBE4E] text-white shadow-md transition-all hover:scale-105 hover:bg-[#25A243] active:scale-95"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Transactions list */}
      <div className="rounded-[32px] border border-border bg-card p-4 shadow-sm">
        {groupedArray.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-base font-bold text-foreground">
              No transactions found
            </p>
            <p className="mt-2 max-w-[250px] text-sm text-muted-foreground">
              {search || filter !== "all"
                ? "We couldn't find any transactions matching your filters."
                : "You don't have any transactions yet. Click the + button to add one."}
            </p>
            {search || filter !== "all" ? (
              <button
                onClick={() => {
                  setSearch("")
                  setFilter("all")
                }}
                className="mt-6 text-sm font-semibold text-[#2BBE4E] hover:underline"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groupedArray.map((group) => (
              <div key={group.title}>
                <h3 className="sticky top-0 z-10 bg-card/90 px-4 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase backdrop-blur-md">
                  {group.title}
                </h3>
                <div className="mt-2 flex flex-col gap-1">
                  {group.items.map((txn) => (
                    <TransactionItem
                      key={txn.id}
                      {...txn}
                      amount={formatter.format(Number(txn.amount))}
                      onClick={() => {
                        setTransactionModalOpen(true)
                        setTransactionDetail(txn)
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TransactionDetailModal
        data={transactionDetail}
        open={transactionModalOpen}
        onClose={() => {
          setTransactionModalOpen(false)
        }}
      />

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {hasNextPage && (
        <div className="flex justify-center p-8">
          <Button
            onClick={() => fetchNextPage()}
            className="rounded-full px-8"
            disabled={loading}
          >
            {loading ? "Loading more..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
