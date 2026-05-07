import { api } from "@/lib/axios"

export async function getCurrentUser() {
  const res = await api.get("/profile/me")
  return res.data
}
