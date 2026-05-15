import { Lightbulb } from "lucide-react"

export default function AiSmartInsight() {
  return (
    <div className="bg-zinc-900 dark:bg-zinc-100 rounded-[24px] p-6 text-white dark:text-zinc-900 h-full relative overflow-hidden flex flex-col justify-center">
      {/* Faded background icon */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Lightbulb className="w-48 h-48" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-gray-300 dark:text-zinc-600">AI Smart Insight</span>
      </div>

      <p className="text-[17px] font-medium leading-snug mb-6 max-w-[85%]">
        You Spent 32% more on food this week. Want tips to reduce it?
      </p>

      <button className="bg-[#2BBE4E] hover:bg-[#25A243] text-white text-sm font-semibold py-2.5 px-6 rounded-lg self-start transition-colors">
        View Suggestions
      </button>
    </div>
  )
}
