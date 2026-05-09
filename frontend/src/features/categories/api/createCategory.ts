import { api } from "@/lib/axios"

interface CategoryData {
  name: string
}

export async function createCategory(data: CategoryData) {
  const res = await api.post("/category/create", data)
  return res.data
}
