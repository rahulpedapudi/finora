import React from "react"

interface SummaryCardProps {
  title: string
  value: string | React.ReactNode
  change?: string
  changeType?: "positive" | "negative"
  variant?: "light" | "dark"
  icon?: React.ReactNode
  showInsights: boolean
  tone?: string
}

export default function SummaryCard({
  title,
  value,
  change,
  changeType,
  variant = "light",
  icon,
  showInsights,
  tone,
}: SummaryCardProps) {
  const isDark = variant === "dark"
  const toneClass =
    tone ?? (changeType === "negative" ? "text-rose-500" : "text-emerald-500")
  const trendLabel = change ?? "—"

  return (
    <div
      className={`flex min-h-[130px] flex-col justify-between rounded-[24px] p-4 sm:h-40 sm:p-6 ${
        isDark
          ? "bg-zinc-900 text-white"
          : "border border-border bg-card text-foreground shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF8F1] text-[#2BBE4E]">
              {icon}
            </div>
          )}
          <p
            className={`truncate text-xs font-semibold ${
              isDark ? "text-gray-300" : "text-muted-foreground"
            }`}
          >
            {title}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            changeType === "negative"
              ? "bg-rose-500/10 text-rose-500"
              : "bg-emerald-500/10 text-emerald-500"
          } ${showInsights ? "" : "opacity-60"}`}
        >
          {trendLabel}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p
            className={`truncate text-lg font-semibold sm:text-2xl ${toneClass}`}
          >
            {value}
          </p>
          <p className="text-[11px] text-muted-foreground">Last 6 months</p>
        </div>
        {/* <div className={`h-12 w-24 ${toneClass}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="currentColor"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </div>
  )
}
