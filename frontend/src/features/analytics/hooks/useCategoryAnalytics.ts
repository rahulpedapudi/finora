import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

type CategoryAnalyticsParams = {
  period: "month" | "week" | "today"
}

export const useCategoryAnalytics = ({ period }: CategoryAnalyticsParams) => {
  return useQuery({
    queryKey: ["categoryAnalytics", period],
    queryFn: async () => {
      const result = await api.get(`/analytics/categories?period=${period}`)
      return result.data
    },
  })
}
