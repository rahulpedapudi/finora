import { Button } from "@/components/ui/button"
import { logout } from "@/features/auth/api/logout"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <h1>Dashboard</h1>
      <Button
        onClick={() => {
          handleLogOut()
        }}
      >
        Log Out
      </Button>
    </>
  )
}
