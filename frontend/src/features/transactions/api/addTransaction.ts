import { api } from "@/lib/axios"

interface TransactionData {
  raw_input: string
  category_id: string | undefined
}

export async function addTransaction(data: TransactionData) {
  const res = await api.post("/transactions/new", data)
  return res.data
}
