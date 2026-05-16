import { api } from "@/lib/axios"

export async function logout() {
  try {
    await api.post("/auth/logout")
  } finally {
    // Always clear local storage, even if the server call fails
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }
}
