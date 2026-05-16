import { useTransactions } from "@/features/transactions/hooks/useTransactions"
import { TrendingDown, TrendingUp } from "lucide-react"
import { formatter } from "@/lib/helpers"
import { useNavigate } from "react-router-dom"

export default function RecentTransactions() {
  const { data, isLoading: transactionsLoading } = useTransactions()
  const navigate = useNavigate()

  // Only show the 5 most recent — first page is already sorted desc by date
  const transactions = (data?.pages[0]?.transactions ?? []).slice(0, 6)

  //   "transactions": [
  //   {
  //     "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  //     "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  //     "raw_input": "string",
  //     "amount": "72700883756045970140622674622257271484910370633709463428140992799593636918289681.884763500681781779476570589823519033217985920067700074265",
  //     "type": "expense",
  //     "category_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  //     "title": "string",
  //     "merchant": "string",
  //     "payment_method": "string",
  //     "note": "string",
  //     "date_of_transaction": "2026-05-15",
  //     "created_at": "2026-05-15T12:24:14.725Z"
  //   }
  // ],

  if (transactionsLoading) {
    return <p>Loading</p>
  }

  return (
    <div className="mb-20 flex h-auto flex-col rounded-[24px] bg-background">
      <div className="mb-4 flex items-center justify-between px-2">
        <h3 className="text-sm font-semibold text-foreground">
          Recent Transactions
        </h3>
        <button
          onClick={() => {
            navigate("/transactions")
          }}
          className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          View All
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 rounded-[24px] border border-border bg-card p-2">
        {transactions.map((tx) => {
          return (
            <div
              key={tx.id}
              className="flex cursor-pointer items-center justify-between rounded-[16px] p-3 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full`}
                >
                  {tx.type === "income" ? (
                    <TrendingUp color="#2BBE4E" />
                  ) : (
                    <TrendingDown color="#fb2c36" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {tx.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {tx.date_of_transaction}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm font-semibold ${tx.type === "income" ? "text-[#2BBE4E]" : "text-red-500"}`}
              >
                {formatter.format(tx.amount)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
