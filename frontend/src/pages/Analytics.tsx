import SummaryCard from "@/components/dashboard/SummaryCard"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCashFlow } from "@/features/analytics/hooks/useCashFlow"
import { useCategoryAnalytics } from "@/features/analytics/hooks/useCategoryAnalytics"
import { useSummary } from "@/features/analytics/hooks/useSummary"
import { formatter } from "@/lib/helpers"
import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function Analytics() {
  const [cashFlowParam, setCashFlowParam] = useState<
    "monthly" | "daily" | "weekly"
  >("monthly")

  const [cashFlowType, setCashFlowType] = useState<
    "net" | "expense" | "income"
  >("net")

  const { data: summaryData, isLoading: summaryLoading } = useSummary()

  const { data: cashFlowData, isLoading: cashFlowLoading } = useCashFlow({
    period: cashFlowParam,
  })

  const [categoryFilter, setCategoryFilter] = useState<
    "week" | "today" | "month"
  >("month")

  const { data: categoryData } = useCategoryAnalytics({
    period: categoryFilter,
  })

  if (summaryLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-[#2BBE4E]" />
      </div>
    )
  }

  if (!summaryData) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Could not load summary data.
      </div>
    )
  }
  let cashflow
  if (!cashFlowLoading) {
    cashflow = cashFlowData.data.map((group: any) => {
      return {
        label: group.label,
        net: group.balance,
        expense: group.expense,
        income: group.income,
      }
    })
  }

  return (
    <>
      <div className="relative mx-auto max-w-6xl space-y-8">
        <div className="absolute inset-x-0 -top-12 -z-10 h-48 rounded-[40px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_70%)]" />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCard
            title="Total Balance"
            value={`${formatter.format(parseFloat(summaryData.savings))}`}
            // change="+5.2%"
            // changeType="positive"
            variant="light"
            showInsights={false}
          />
          <SummaryCard
            title="Monthly Income"
            value={`${formatter.format(parseFloat(summaryData.income))}`}
            showInsights={
              summaryData.income_change_percentage == null ? false : true
            }
            change={`${summaryData.income_change_percentage}%`}
            changeType={
              summaryData.income_change_percentage > 0 ? "positive" : "negative"
            }
            variant="light"
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
          />
          <SummaryCard
            title="Monthly Expenses"
            value={
              !summaryLoading &&
              `${formatter.format(parseFloat(summaryData.expense))}`
            }
            change={`${summaryData.expense_change_percentage}%`}
            changeType={
              summaryData.expense_change_percentage > 0
                ? "positive"
                : "negative"
            }
            variant="light"
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            showInsights={
              summaryData.expense_change_percentage == null ? false : true
            }
          />
          <SummaryCard
            title="Savings Rate"
            value={!summaryLoading && `${summaryData.savings_rate}%`}
            change={`${summaryData.savings_change_percentage}%`}
            changeType={
              summaryData.savings_change_percentage > 0
                ? "positive"
                : "negative"
            }
            variant="light"
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            showInsights={
              summaryData.savings_change_percentage == null ? false : true
            }
          />
        </div>

        {/* CashFlow */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.6)]">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Cashflow
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="cashflow-filter"
                  className="text-xs text-muted-foreground"
                >
                  Filter by
                </label>
                <Select
                  value={cashFlowParam}
                  onValueChange={(value: "monthly" | "weekly" | "daily") => {
                    setCashFlowParam(value)
                  }}
                >
                  <SelectTrigger className="h-8 w-[100px] text-xs">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <label
                  htmlFor="cashflow-type"
                  className="text-xs text-muted-foreground"
                >
                  Type
                </label>
                <Select
                  value={cashFlowType}
                  onValueChange={(value: "net" | "expense" | "income") => {
                    setCashFlowType(value)
                  }}
                >
                  <SelectTrigger className="h-8 w-[100px] text-xs">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="net">Net</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflow} margin={{ left: 0, right: 8 }}>
                  <defs>
                    <linearGradient
                      id="cashflowFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#60a5fa"
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="100%"
                        stopColor="#60a5fa"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.3)"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#888888" }}
                    minTickGap={30}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#888888" }}
                    width={45}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) =>
                      `${value && formatter.format(value as number)}`
                    }
                    labelClassName="text-xs text-muted-foreground"
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#f8fafc",
                      borderRadius: 12,
                      border: "1px solid rgba(148,163,184,0.2)",
                    }}
                    itemStyle={{ color: "#60a5fa" }}
                  />
                  <Area
                    type="monotone"
                    dataKey={cashFlowType}
                    stroke="#60a5fa"
                    strokeWidth={2}
                    fill="url(#cashflowFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.6)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Category Analysis
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="category-filter"
                  className="text-xs text-muted-foreground"
                >
                  Filter by
                </label>
                <Select
                  value={categoryFilter}
                  onValueChange={(value: "month" | "week" | "today") => {
                    setCategoryFilter(value)
                  }}
                >
                  <SelectTrigger className="h-8 w-[110px] text-xs">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ left: 10, right: 24 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="rgba(148,163,184,0.3)"
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#888888" }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#888888" }}
                  />
                  <Tooltip
                    // formatter={(value) => `${value && formatter.format(value)}`}
                    labelClassName="text-xs text-muted-foreground"
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#f8fafc",
                      borderRadius: 12,
                      border: "1px solid rgba(148,163,184,0.2)",
                    }}
                    itemStyle={{ color: "#f97316" }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="total_amount"
                    fill="#f97316"
                    radius={[8, 8, 8, 8]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
