// import { Target, Utensils, Tv, ChevronRight } from "lucide-react"

// export default function AiRecommendations() {
//   const recommendations = [
//     {
//       title: "Save $5,000",
//       desc: "This is to get that Laptop",
//       icon: Target,
//       iconBg: "bg-muted",
//       iconColor: "text-foreground"
//     },
//     {
//       title: "Reduce Food Spending",
//       desc: "Try a weekly budget",
//       icon: Utensils,
//       iconBg: "bg-orange-500/20",
//       iconColor: "text-orange-500"
//     },
//     {
//       title: "Upcoming Bill",
//       desc: "Netflix: $100",
//       icon: Tv,
//       iconBg: "bg-red-500/20",
//       iconColor: "text-red-500"
//     }
//   ]

//   return (
//     <div className="bg-background rounded-[24px] h-full flex flex-col">
//       <div className="flex items-center justify-between mb-4 px-2">
//         <div className="flex items-center gap-2">
//            <span className="text-sm font-semibold text-foreground">AI Recommendations</span>
//         </div>
//         <button className="text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1 bg-card shrink-0">
//           View All
//         </button>
//       </div>

//       <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
//         {recommendations.map((rec, idx) => {
//           const Icon = rec.icon
//           return (
//             <div key={idx} className="bg-card rounded-[20px] p-5 border border-border flex-1 min-w-[140px] max-w-[200px] flex flex-col items-start hover:shadow-md transition-shadow cursor-pointer">
//               <div className={`w-10 h-10 rounded-xl ${rec.iconBg} flex items-center justify-center mb-4 shrink-0`}>
//                 <Icon className={`w-5 h-5 ${rec.iconColor}`} />
//               </div>
//               <div className="w-full">
//                  <h4 className="text-xs font-bold text-foreground mb-1 truncate w-full">{rec.title}</h4>
//                  <p className="text-[10px] text-muted-foreground line-clamp-2">{rec.desc}</p>
//               </div>
//             </div>
//           )
//         })}
//         {/* Next Arrow Card */}
//         <div className="bg-card rounded-[20px] border border-border w-12 shrink-0 flex items-center justify-center hover:bg-muted cursor-pointer transition-colors">
//            <ChevronRight className="w-5 h-5 text-muted-foreground" />
//         </div>
//       </div>
//     </div>
//   )
// }
