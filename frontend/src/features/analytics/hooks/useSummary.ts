import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

export const useSummary = () => {
  return useQuery({
    queryKey: ["summary"],

    queryFn: async () => {
      const result = await api.get("/analytics/summary")
      return result.data
    },
  })
}
