// import { useTransactionState } from "@/features/transactions/store/transactionState"

// function getLast7Days() {
//   const days = []
//   for (let i = 6; i >= 0; i--) {
//     const d = new Date()
//     d.setDate(d.getDate() - i)
//     days.push(d)
//   }
//   return days
// }

// function formatDay(date: Date) {
//   return date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3)
// }

// function isSameDay(a: Date, b: Date) {
//   return (
//     a.getFullYear() === b.getFullYear() &&
//     a.getMonth() === b.getMonth() &&
//     a.getDate() === b.getDate()
//   )
// }

// export default function SpendingChart() {
//   const transactions = useTransactionState((s) => s.data)
//   const days = getLast7Days()

//   const dailySpend = days.map((day) => {
//     const total = transactions
//       .filter(
//         (t) =>
//           t.type === "expense" && isSameDay(new Date(t.date || t.created_at), day)
//       )
//       .reduce((sum, t) => sum + Number(t.amount), 0)
//     return { day, label: formatDay(day), total }
//   })

//   const maxSpend = Math.max(...dailySpend.map((d) => d.total), 1)
//   const totalWeek = dailySpend.reduce((sum, d) => sum + d.total, 0)

//   return (
//     <div className="bg-card border border-border rounded-xl p-5">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-sm font-semibold text-foreground">
//             Spending This Week
//           </h3>
//           <p className="text-xs text-muted-foreground mt-0.5">
//             Last 7 days
//           </p>
//         </div>
//         <span className="text-sm font-semibold text-foreground">
//           ₹{totalWeek.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
//         </span>
//       </div>

//       {/* Bar chart */}
//       <div className="flex items-end gap-2 h-28">
//         {dailySpend.map(({ label, total }, i) => {
//           const height = maxSpend > 0 ? (total / maxSpend) * 100 : 0
//           const isToday = i === 6
//           return (
//             <div
//               key={label}
//               className="flex-1 flex flex-col items-center gap-2"
//             >
//               <div className="w-full flex flex-col justify-end h-20 relative group">
//                 {/* Tooltip */}
//                 {total > 0 && (
//                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border text-xs text-foreground px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10">
//                     ₹{total.toLocaleString("en-IN")}
//                   </div>
//                 )}
//                 <div
//                   className={`w-full rounded-md transition-all duration-300 ${
//                     isToday ? "bg-blue-500" : "bg-blue-500/30"
//                   }`}
//                   style={{ height: `${Math.max(height, total > 0 ? 4 : 0)}%` }}
//                 />
//               </div>
//               <span
//                 className={`text-[10px] font-medium ${
//                   isToday ? "text-blue-400" : "text-muted-foreground"
//                 }`}
//               >
//                 {label}
//               </span>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
