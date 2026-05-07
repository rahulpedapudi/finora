import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <>
      <Button onClick={() => navigate("/login")}>Login</Button>
      <Button onClick={() => navigate("/register")}>Register</Button>
      <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
    </>
  )
}
