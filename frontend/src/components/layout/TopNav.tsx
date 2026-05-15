import { useLocation } from "react-router-dom"
import { useAuthStore } from "@/features/auth/store/authStore"

export default function TopNav() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  const isDashboard =
    location.pathname === "/dashboard" || location.pathname === "/"

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-4 md:px-6">
      <div className="flex items-center gap-4">
        {/* Profile Image Approximation */}

        <div>
          {isDashboard ? (
            <>
              <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground md:text-[22px]">
                Welcome, {user?.name ? user.name.split(" ")[0] : "Divine"}{" "}
                <span className="text-base md:text-xl">👋</span>
              </h1>
            </>
          ) : (
            <h1 className="text-xl font-bold tracking-tight text-foreground capitalize">
              {location.pathname.slice(1) || "Dashboard"}
            </h1>
          )}
        </div>
      </div>

      {/* <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-600 shadow-sm transition-colors hover:text-gray-900">
          <Search className="h-5 w-5" />
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-600 shadow-sm transition-colors hover:text-gray-900">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border border-white bg-[#2BBE4E]"></span>
        </button>
      </div> */}
    </header>
  )
}
