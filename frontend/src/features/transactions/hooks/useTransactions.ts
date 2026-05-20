import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

interface Cursor {
  cursor_date: string
  cursor_created_at: string
}

export const useTransactions = () => {
  return useInfiniteQuery({
    queryKey: ["transactions"],

    initialPageParam: null as Cursor | null,

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams()

      params.append("limit", "10")

      if (pageParam?.cursor_date) {
        params.append("cursor_date", pageParam.cursor_date)
      }

      if (pageParam?.cursor_created_at) {
        params.append("cursor_created_at", pageParam.cursor_created_at)
      }

      const response = await api.get(`/transactions/?${params.toString()}`)

      return response.data
    },

    getNextPageParam: (lastPage): Cursor | null => {
      return lastPage.next_cursor ?? null
    },
  })
}
