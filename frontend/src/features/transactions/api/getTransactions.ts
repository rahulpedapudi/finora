import { api } from "@/lib/axios"

export async function getTransactions() {
  const res = await api.get("/transactions/")
  return res.data
}
