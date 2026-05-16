import SummaryCard from "@/components/dashboard/SummaryCard"
import SpendingOverview from "@/components/dashboard/SpendingOverview"
// import AiSmartInsight from "@/components/dashboard/AiSmartInsight"
// import AiRecommendations from "@/components/dashboard/AiRecommendations"
import { useSummary } from "@/features/analytics/hooks/useSummary"
import { formatter } from "@/lib/helpers"
import RecentTransactions from "@/components/dashboard/RecentTransactions"
import DashboardFAB from "@/components/dashboard/DashboardFAB"

// {
//   "expense": "25480.00",
//   "income": "929000.00",
//   "savings": "903520.00",
//   "savings_rate": "97.26",
//   "income_change_percentage": "446.47",
//   "expense_change_percentage": null,
//   "savings_change_percentage": "431.48",
//   "total_transactions": 13,
//   "highest_expense": "23000.00"
// }
export default function Dashboard() {
  const { data: summaryData, isLoading: summaryLoading } = useSummary()

  if (summaryLoading) {
    return "Loading"
  }
  console.log(summaryData)
  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col gap-4">
      {/* Top Row: Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
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
            summaryData.expense_change_percentage > 0 ? "positive" : "negative"
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
            summaryData.savings_change_percentage > 0 ? "positive" : "negative"
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

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Column */}
        <div className="flex flex-col gap-4 lg:col-span-7 xl:col-span-8">
          {/* Spending Overview */}
          <div className="flex-none">
            <SpendingOverview />
          </div>

          {/* AI Recommendations */}
          {/* <div className="flex-1">
            <AiRecommendations />
          </div> */}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 lg:col-span-5 xl:col-span-4">
          <div className="flex flex-col gap-4">
            {/* <AiSmartInsight /> */}
            {/* <QuickActions /> */}
          </div>

          <div className="flex-1">
            <RecentTransactions />
          </div>
        </div>
      </div>

      <DashboardFAB />
    </div>
  )
}
