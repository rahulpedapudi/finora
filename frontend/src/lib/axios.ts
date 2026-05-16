import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
  baseURL: BASE_URL,
})

const refreshApi = axios.create({
  baseURL: BASE_URL,
})

// Attach the access token to every request from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    // Access token expired — try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")

        if (!refreshToken) throw new Error("No refresh token")

        // Exchange refresh token for new tokens
        const res = await refreshApi.post("/auth/refresh", {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token } = res.data
        localStorage.setItem("access_token", access_token)
        localStorage.setItem("refresh_token", refresh_token)

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed — clear storage and log out
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")

        import("../features/auth/store/authStore").then(({ useAuthStore }) => {
          useAuthStore.getState().logout()
        })

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
