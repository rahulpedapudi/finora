import { Eye, TrendingUp, TrendingDown } from "lucide-react"
import React from "react"

interface FinaiSummaryCardProps {
  title: string
  value: string | React.ReactNode
  change?: string
  changeType?: "positive" | "negative"
  variant?: "light" | "dark"
  icon?: React.ReactNode
  showInsights: boolean
}

export default function SummaryCard({
  title,
  value,
  change,
  changeType,
  variant = "light",
  icon,
  showInsights,
}: FinaiSummaryCardProps) {
  const isDark = variant === "dark"

  return (
    <div
      className={`flex min-h-[130px] sm:h-40 flex-col justify-between rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 ${
        isDark
          ? "bg-zinc-900 dark:bg-[#2BBE4E] text-white"
          : "border border-border bg-card text-foreground shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
      }`}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF8F1] text-[#2BBE4E]">
            {icon}
          </div>
        )}
        <span
          className={`text-xs sm:text-sm font-medium truncate ${isDark ? "text-gray-300 dark:text-green-50" : "text-muted-foreground"}`}
        >
          {title}
        </span>
        {/* {isDark && <Eye className="ml-1 h-4 w-4 text-gray-400" />} */}
      </div>

      <div>
        <div className="mt-2 mb-3 text-lg sm:text-2xl font-bold tracking-tight lg:text-3xl truncate">
          {value}
        </div>
        {/* i wanna show to something so that the ui doesnt feel awkward */}
        {showInsights && (
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 font-medium ${
                changeType === "positive"
                  ? isDark
                    ? "bg-[#2BBE4E]/20 text-[#2BBE4E] dark:bg-white/20 dark:text-white"
                    : "bg-[#EEF8F1] text-[#2BBE4E]"
                  : isDark
                    ? "bg-red-500/20 text-red-400 dark:bg-white/20 dark:text-red-100"
                    : "bg-red-50 text-red-500"
              }`}
            >
              {changeType === "positive" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {change}
            </div>
            <span className={`hidden sm:inline ${isDark ? "text-gray-400 dark:text-green-100" : "text-muted-foreground"}`}>
              vs last month
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
