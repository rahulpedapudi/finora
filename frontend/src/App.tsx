import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import LoginPage from "./features/auth/pages/LoginPage.tsx"
import RegisterPage from "./features/auth/pages/RegisterPage"
import ProtectedRoute from "./features/auth/components/ProtectedRoute"
import AuthLoader from "./features/auth/components/AuthLoader.tsx"
import AppLayout from "./components/layout/AppLayout"
import Dashboard from "./pages/Dashboard"
import HomePage from "./pages/HomePage.tsx"
import Transactions from "./pages/Transactions"
import Analytics from "./pages/Analytics"
import Budgets from "./pages/Budgets"
import Settings from "./pages/Settings"

export default function App() {
  return (
    <Router>
      <AuthLoader>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* All authenticated routes under AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthLoader>
    </Router>
  )
}
