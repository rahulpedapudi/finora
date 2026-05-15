import { ArrowUpRight, Plus, ArrowDownLeft, Calendar } from "lucide-react"

export default function QuickActions() {
  const actions = [
    { label: "Send Money", icon: ArrowUpRight, iconColor: "text-[#2BBE4E]", bgColor: "bg-[#EEF8F1] dark:bg-[#EEF8F1]/10" },
    { label: "Add Funds", icon: Plus, iconColor: "text-muted-foreground", bgColor: "bg-muted" },
    { label: "Receive Funds", icon: ArrowDownLeft, iconColor: "text-[#2BBE4E]", bgColor: "bg-[#EEF8F1] dark:bg-[#EEF8F1]/10" },
    { label: "Schedule Pay", icon: Calendar, iconColor: "text-muted-foreground", bgColor: "bg-muted" },
  ]

  return (
    <div className="bg-card rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border h-full flex flex-col justify-center">
      <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon
          return (
            <button key={idx} className="flex flex-col items-center gap-2 group">
              <div className={`w-14 h-14 rounded-2xl ${action.bgColor} flex items-center justify-center transition-transform group-hover:scale-105 group-hover:shadow-sm`}>
                <Icon className={`w-5 h-5 ${action.iconColor}`} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight w-12">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
