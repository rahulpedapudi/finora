import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

type CashFlowParams = {
  period: "monthly" | "weekly" | "daily"
}

export const useCashFlow = ({ period }: CashFlowParams) => {
  return useQuery({
    queryKey: ["cashflow", period],
    queryFn: async () => {
      const res = await api.get(`/analytics/cashflow?period=${period}`)
      return res.data
    },
  })
}
