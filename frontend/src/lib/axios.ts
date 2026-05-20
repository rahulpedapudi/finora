import axios from "axios"
import { supabase } from "@/lib/supabase/client"
import { useAuthStore } from "@/features/auth/store/authStore"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
  baseURL: BASE_URL,
})

// Attach Supabase access token to every request
api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

// Handle 401s — if the session is truly dead, sign out
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      await supabase.auth.signOut()
    }
    return Promise.reject(error)
  }
)
