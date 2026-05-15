import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import { api } from "@/lib/axios"

interface TransactionData {
  raw_input: string
}

export const useAddTransaction = () => {
  return useMutation({
    mutationFn: async (data: TransactionData) => {
      const res = await api.post("/transactions/new", data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      })
      queryClient.invalidateQueries({
        queryKey: ["categoryAnalytics"],
      })
      queryClient.invalidateQueries({
        queryKey: ["summary"],
      })
    },
  })
}
