import { create } from "zustand"
import { api } from "@/lib/axios"

interface CategoryData {
  id: number
  name: string
}

interface CategoryState {
  data: CategoryData[]
  isLoading: boolean
  error: string | null
  fetchCategories: (url: string) => Promise<void>
}

export const useCategoryState = create<CategoryState>((set) => ({
  data: [],
  isLoading: false,
  error: null,

  fetchCategories: async (url: string) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(url)
      const result: CategoryData[] = res.data
      set({ data: result, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "error occured",
      })
    }
  },
}))
