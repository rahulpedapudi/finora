import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useTransactionState } from "@/features/transactions/store/transactionState"
import { useCategoryState } from "@/features/categories/store/catergoryState"
import { Sparkles, LayoutList } from "lucide-react"

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
}

export default function AddTransactionModal({
  open,
  onClose,
}: AddTransactionModalProps) {
  const [mode, setMode] = useState<"smart" | "structured">("smart")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Smart mode
  const [rawInput, setRawInput] = useState("")
  const [smartCategory, setSmartCategory] = useState<string>()

  // Structured mode
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"expense" | "income">("expense")
  const [note, setNote] = useState("")
  const [structCategory, setStructCategory] = useState<string>()
  const [date, setDate] = useState("")

  const postTransaction = useTransactionState((s) => s.postTransaction)
  const categories = useCategoryState((s) => s.data)

  const reset = () => {
    setRawInput("")
    setSmartCategory(undefined)
    setAmount("")
    setType("expense")
    setNote("")
    setStructCategory(undefined)
    setDate("")
    setError("")
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rawInput.trim()) return
    setLoading(true)
    setError("")
    try {
      await postTransaction({ raw_input: rawInput.trim(), category_id: smartCategory })
      handleClose()
    } catch {
      setError("Failed to add transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleStructuredSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) {
      setError("Please enter a valid amount.")
      return
    }
    setLoading(true)
    setError("")
    // Build a raw_input string the backend parser can handle
    const rawString =
      type === "income"
        ? `income ${amount}${note ? " " + note : ""}`
        : `${amount}${note ? " " + note : ""}`
    try {
      await postTransaction({
        raw_input: rawString,
        category_id: structCategory,
      })
      handleClose()
    } catch {
      setError("Failed to add transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Add Transaction
          </DialogTitle>
        </DialogHeader>

        {/* Mode toggle */}
        <div className="flex gap-2 p-1 bg-background rounded-lg border border-border">
          <button
            onClick={() => setMode("smart")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md transition-colors ${
              mode === "smart"
                ? "bg-blue-500 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Smart
          </button>
          <button
            onClick={() => setMode("structured")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md transition-colors ${
              mode === "structured"
                ? "bg-blue-500 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutList className="w-3 h-3" />
            Manual
          </button>
        </div>

        {/* Smart mode */}
        {mode === "smart" && (
          <form onSubmit={handleSmartSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Describe the transaction
              </Label>
              <Input
                placeholder='e.g. "250 swiggy" or "salary 50000"'
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground/60">
                The amount and type will be parsed automatically.
              </p>
            </div>

            {categories.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Category (optional)
                </Label>
                <Select onValueChange={setSmartCategory}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="flex-1 text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !rawInput.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        )}

        {/* Structured mode */}
        {mode === "structured" && (
          <form onSubmit={handleStructuredSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background border-border text-foreground"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as "expense" | "income")}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Select onValueChange={setStructCategory}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Note / Merchant
              </Label>
              <Input
                placeholder="e.g. Swiggy, rent..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Date (optional)
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="flex-1 text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !amount}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
