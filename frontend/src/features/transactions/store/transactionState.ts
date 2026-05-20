import { api } from "@/lib/axios"
import { create } from "zustand"

interface TransactionData {
  id: string
  title: string
  user_id: string
  raw_input: string
  amount: number
  type: "expense" | "income"
  merchant: string
  payment_method: string
  note: string
  date_of_transaction: Date
  created_at: Date
}

interface TransactionStore {
  data: TransactionData[]
  fetchTransactions: () => Promise<void>
}

export const useTransactionState = create<TransactionStore>((set) => ({
  data: [],

  fetchTransactions: async () => {
    const res = await api.get("/transactions/")
    set({ data: res.data })
  },
}))
