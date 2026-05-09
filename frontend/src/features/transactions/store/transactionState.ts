import { api } from "@/lib/axios"
import { create } from "zustand"
import { addTransaction } from "../api/addTransaction"

interface TransactionData {
  id: string
  user_id: string
  raw_input: string
  amount: number
  type: "expense" | "income"
  merchant: string
  payment_method: string
  note: string
  date: string
  created_at: string
}

interface TransactionPostData {
  raw_input: string
  category_id: string | undefined
}

interface TransactionStore {
  data: TransactionData[]
  fetchTransactions: () => Promise<void>
  postTransaction: (data: TransactionPostData) => Promise<void>
}

export const useTransactionState = create<TransactionStore>((set, get) => ({
  data: [],

  fetchTransactions: async () => {
    const res = await api.get("/transactions")
    set({ data: res.data })
  },

  postTransaction: async (data: TransactionPostData) => {
    await addTransaction(data)
    await get().fetchTransactions()
  },
}))
