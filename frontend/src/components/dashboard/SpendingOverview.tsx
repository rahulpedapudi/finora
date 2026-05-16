import { useCategoryAnalytics } from "@/features/analytics/hooks/useCategoryAnalytics"
import { Pie, PieChart } from "recharts"
import { useState } from "react"
import { formatter } from "@/lib/helpers"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// [
//   {
// "id": "8c5f5cdc-e53c-40a2-b1d8-698f431821d5",
// "name": "Subscription",
// "color": "#6366f1",
// "total_amount": "1916.00",
// "transactions": 7,
// "percentage": "6.98"
//   }
// ]

interface CategoryType {
  id: number
  name: string
  color: string
  total_amount: number
  transactions: number
  percentage: number
}

// const CustomPieTooltip = ({
//   active,
//   payload,
// }: TooltipContentProps<number, string>) => {
//   if (!active || !payload || payload.length === 0) {
//     return null
//   }

//   const item = payload[0]
//   const label = item?.name ?? "Unknown"
//   const value =
//     typeof item?.value === "number" ? item.value : Number(item?.value ?? 0)

//   return (
//     <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm">
//       <div className="font-medium text-foreground">{label}</div>
//       <div className="text-muted-foreground">{formatter.format(value)}</div>
//     </div>
//   )
// }

export default function SpendingOverview() {
  const [spendingOverviewFilter, setSpendingOverviewFilter] = useState<
    "week" | "today" | "month"
  >("week")

  const { data: categories, isLoading: categoryLoading } = useCategoryAnalytics(
    { period: spendingOverviewFilter }
  )

  if (categoryLoading) {
    return <p>Loading</p>
  }

  const data = !categoryLoading
    ? categories.map((cat: CategoryType) => ({
        name: cat.name,
        value: Number(cat.total_amount),
        fill: cat.color,
      }))
    : []

  console.log(data)

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-border bg-card p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Spending Overview
        </h3>
        <Select
          defaultValue="week"
          value={spendingOverviewFilter}
          onValueChange={(value: "week" | "today" | "month") => {
            setSpendingOverviewFilter(value)
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="today">Today</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Donut Chart Side */}
        <PieChart
          style={{
            width: "100%",
            maxWidth: "300px",
            maxHeight: "50vh",
            aspectRatio: 1,
          }}
          responsive
        >
          <Pie
            data={data}
            innerRadius="80%"
            outerRadius="100%"
            // Corner radius is the rounded edge of each pie slice
            cornerRadius="12%"
            fill="#8884d8"
            // padding angle is the gap between each pie slice
            paddingAngle={1}
            dataKey="value"
            isAnimationActive={true}
          />
        </PieChart>

        {/* Breakdown List Side */}
        <div className="flex flex-col justify-center space-y-4 pt-4 lg:pt-0">
          {categories.map((cat: CategoryType) => {
            return (
              <div
                key={cat.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    style={{ backgroundColor: cat.color }}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md`}
                  ></div>
                  <span className="truncate font-medium text-foreground">
                    {cat.name}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-4 pl-2">
                  <span className="min-w-12 text-right font-semibold text-foreground">
                    {formatter.format(cat.total_amount)}
                  </span>
                  <span className="min-w-8 text-right text-xs text-muted-foreground">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
