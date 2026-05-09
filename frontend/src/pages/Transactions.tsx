import { useEffect, useState } from "react"
import { Search, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTransactionState } from "@/features/transactions/store/transactionState"
import { useCategoryState } from "@/features/categories/store/catergoryState"
import TransactionItem from "@/components/transactions/TransactionItem"
import AddTransactionModal from "@/components/transactions/AddTransactionModal"
import { api } from "@/lib/axios"

type FilterType = "all" | "income" | "expense"

export default function Transactions() {
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  const { data: transactions, fetchTransactions } = useTransactionState()
  const { fetchCategories } = useCategoryState()

  useEffect(() => {
    fetchTransactions()
    fetchCategories("/category")
  }, [])

  const filtered = [...transactions]
    .reverse()
    .filter((t) => {
      if (filter !== "all" && t.type !== filter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          t.raw_input?.toLowerCase().includes(q) ||
          t.merchant?.toLowerCase().includes(q) ||
          t.note?.toLowerCase().includes(q)
        )
      }
      return true
    })

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`)
      await fetchTransactions()
    } catch (e) {
      console.error(e)
    }
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">
            {transactions.length} txns
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">Income</p>
          <p className="text-sm font-semibold text-green-400 mt-0.5">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">Expenses</p>
          <p className="text-sm font-semibold text-red-400 mt-0.5">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-card border border-border rounded-lg w-fit">
        {(["all", "income", "expense"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
              filter === f
                ? "bg-blue-500 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transactions list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              No transactions found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search
                ? "Try adjusting your search"
                : "Add your first transaction to get started"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((txn) => (
              <TransactionItem
                key={txn.id}
                {...txn}
                amount={Number(txn.amount)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
