import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LoginPage from "./features/auth/pages/LoginPage.tsx"
import RegisterPage from "./features/auth/pages/RegisterPage"
import ProtectedRoute from "./features/auth/components/ProtectedRoute"
import AuthLoader from "./features/auth/components/AuthLoader.tsx"
import Dashboard from "./pages/Dashboard"
import HomePage from "./pages/HomePage.tsx"

export default function App() {
  return (
    <Router>
      <AuthLoader>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthLoader>
    </Router>
  )
}
