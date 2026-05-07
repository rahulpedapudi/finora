import React, { useState } from "react"
import { register } from "../api/register"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault()

    try {
      await register({ name, email, password })
      console.log("registration successful")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <form onSubmit={handleRegister}>
        <input
          placeholder="Enter Your Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
        <input type="submit" value={"Register"} />
      </form>
      <button
        onClick={() => {
          navigate("/login")
        }}
        type="button"
      >
        Existing User?
      </button>
    </>
  )
}
