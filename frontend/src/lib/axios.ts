import axios from "axios"

const BASE_URL = "http://192.168.31.6:8000/"

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    // token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // get new access token
        await refreshApi.post("/auth/refresh")

        // retry failed request
        return api(originalRequest)
      } catch (refreshError) {
        // refresh failed
        // Remove hard redirect to prevent infinite loops on public pages
        // window.location.href = "/login"

        // Let Zustand and ProtectedRoute handle the redirect gracefully
        import("../features/auth/store/authStore").then(({ useAuthStore }) => {
          useAuthStore.getState().logout()
        })

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
