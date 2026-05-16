import { api } from "@/lib/axios"

export async function refreshAccessToken() {
  const refresh_token = localStorage.getItem("refresh_token")
  const res = await api.post("/auth/refresh", { refresh_token })
  return res.data
}
