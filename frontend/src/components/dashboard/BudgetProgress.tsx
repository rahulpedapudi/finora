// import { Progress } from "@/components/ui/progress"
// import { useCategoryAnalytics } from "@/features/analytics/hooks/useCategoryAnalytics"

// interface categoryResponse {
//   id: string
//   name: string
//   total_amount: number
//   percentage: number
// }

// export default function BudgetProgress() {
//   const { data: categorySummary, isLoading: summaryLoading } =
//     useCategoryAnalytics()
//   return (
//     <div className="rounded-xl border border-border bg-card p-5">
//       <div className="mb-5 flex items-center justify-between">
//         <h3 className="text-sm font-semibold text-foreground">
//           Category Overview
//         </h3>
//         <span className="text-xs text-muted-foreground">This month</span>
//       </div>

//       <div className="space-y-4">
//         {!summaryLoading &&
//           categorySummary.map(
//             ({ id, name, total_amount, percentage }: categoryResponse) => {
//               return (
//                 <div key={id}>
//                   <div className="mb-1.5 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs font-medium text-foreground">
//                         {name}
//                       </span>
//                     </div>
//                     <div className="text-right">₹{total_amount}</div>
//                   </div>
//                   <div className="relative">
//                     <Progress value={percentage} className="h-1.5" />

//                     <div
//                       className="absolute inset-0 h-1.5 rounded-full"
//                       style={{
//                         background:
//                           "linear-gradient(90deg, transparent 60%, rgba(239,68,68,0.4) 100%)",
//                         width: `${percentage}%`,
//                       }}
//                     />
//                   </div>
//                   <p className="mt-1 text-[10px] text-muted-foreground">
//                     {percentage}% of expenses
//                   </p>
//                 </div>
//               )
//             }
//           )}
//       </div>
//     </div>
//   )
// }
