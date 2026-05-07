import { api } from "@/lib/axios"

interface RegisterData {
  name: string
  email: string
  password: string
}

export async function register(data: RegisterData) {
  const res = await api.post("/auth/register", data)
  return res.data
}
