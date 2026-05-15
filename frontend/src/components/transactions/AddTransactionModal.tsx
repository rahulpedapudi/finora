import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAddTransaction } from "@/features/transactions/hooks/useAddTransactions"

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
}

export default function AddTransactionModal({
  open,
  onClose,
}: AddTransactionModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [rawInput, setRawInput] = useState("")

  const postTransaction = useAddTransaction()

  const reset = () => {
    setRawInput("")
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
      postTransaction.mutate({ raw_input: rawInput })
      handleClose()
    } catch {
      setError("Failed to add transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Add Transaction
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSmartSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Describe the transaction
            </Label>
            <Input
              placeholder='e.g. "250 swiggy" or "salary 50000"'
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground/50"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground/60">
              The amount and type will be parsed automatically.
            </p>
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
              disabled={loading || !rawInput.trim()}
              className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
