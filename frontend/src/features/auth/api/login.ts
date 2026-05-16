import { api } from "@/lib/axios"

interface LoginData {
  email: string
  password: string
}

export async function login(data: LoginData) {
  const res = await api.post("/auth/login", data)

  // Store tokens in localStorage for Bearer auth
  localStorage.setItem("access_token", res.data.access_token)
  localStorage.setItem("refresh_token", res.data.refresh_token)

  return res.data
}
