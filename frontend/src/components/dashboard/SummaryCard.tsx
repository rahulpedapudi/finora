import type { ReactNode } from "react"

interface SummaryCardProps {
  label: string
  value: string
  icon: ReactNode
  trend?: string
  trendUp?: boolean
  accentClass?: string
}

export default function SummaryCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  accentClass = "bg-blue-500/10 text-blue-400",
}: SummaryCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold text-foreground tracking-tight">
          {value}
        </p>
        {trend && (
          <p
            className={`text-xs mt-1 font-medium ${
              trendUp ? "text-green-400" : "text-red-400"
            }`}
          >
            {trendUp ? "▲" : "▼"} {trend}
          </p>
        )}
      </div>
    </div>
  )
}
