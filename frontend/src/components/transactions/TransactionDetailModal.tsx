import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, CreditCard, Tag, AlignLeft, Building2 } from "lucide-react"

interface TransactionType {
  id: string
  title: string
  category_id: string
  amount: number
  merchant: string
  payment_method: string
  note: string
  type: "income" | "expense"
  date_of_transaction: string
  created_at: string
}

interface TransactionDetailModalProps {
  data: TransactionType | undefined
  open: boolean
  onClose: () => void
}

export default function TransactionDetailModal({
  data,
  open,
  onClose,
}: TransactionDetailModalProps) {
  const handleClose = () => {
    onClose()
  }

  const amount = data?.amount
  const isIncome = data?.type === "income"
  const amountPrefix = isIncome ? "+" : "-"
  const amountColor = isIncome ? "text-[#2BBE4E]" : "text-foreground"
  const amountBgColor = isIncome
    ? "bg-[#EEF8F1] dark:bg-[#EEF8F1]/10 text-[#2BBE4E]"
    : "bg-muted text-muted-foreground"
  var formattedDate = ""
  var formattedAmount
  if (amount) {
    formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }
  if (data?.date_of_transaction) {
    formattedDate = new Date(data.date_of_transaction).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden border-border bg-card p-0 text-foreground shadow-2xl sm:max-w-106.25">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
              {data?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Transaction Details
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col items-center justify-center space-y-3 rounded-2xl border border-border bg-muted/50 p-6 shadow-inner">
            <div
              className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase ${amountBgColor}`}
            >
              {isIncome ? "Income" : "Expense"}
            </div>
            <h2
              className={`text-4xl font-bold tracking-tighter ${amountColor}`}
            >
              {amountPrefix}
              {formattedAmount}
            </h2>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="space-y-4 rounded-2xl border border-border bg-muted/50 p-5 shadow-inner">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </div>
              <span className="font-medium text-foreground">
                {formattedDate}
              </span>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Merchant</span>
              </div>
              <span className="font-medium text-foreground">
                {data?.merchant || "N/A"}
              </span>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Payment Method</span>
              </div>
              <span className="font-medium text-foreground capitalize">
                {data?.payment_method || "N/A"}
              </span>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Category</span>
              </div>
              <span className="font-medium text-foreground">
                {data?.category_id || "Uncategorized"}
              </span>
            </div>
          </div>

          {data?.note && (
            <div className="mt-4 space-y-3 rounded-2xl border border-border bg-muted/50 p-5 text-sm shadow-inner">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <AlignLeft className="h-4 w-4" />
                <span>Note</span>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {data.note}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
