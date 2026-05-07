import React, { useState } from "react"
import { login } from "../api/login"
import { useAuthStore } from "../store/authStore"
import { getCurrentUser } from "../api/getCurrentUser"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      const user = await getCurrentUser()

      setUser(user)
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          placeholder="john@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Enter Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value={"Login"} />
      </form>
      <button
        onClick={() => {
          navigate("/register")
        }}
        type="button"
      >
        New User?
      </button>
    </>
  )
}
