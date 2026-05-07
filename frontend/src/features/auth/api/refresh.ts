import { api } from "@/lib/axios"

export async function refreshAccessToken() {
  const res = await api.post("/auth/refresh")
  return res.data
}
