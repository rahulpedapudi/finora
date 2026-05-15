# Integration Guide: Connecting Real Data to the FINAI Dashboard

This guide explains how to replace the static dummy data in the new FINAI dashboard layout with real, dynamic data from your Zustand stores and API hooks.

## 1. Top Summary Cards (`Dashboard.tsx` & `FinaiSummaryCard.tsx`)

Currently, `Dashboard.tsx` uses a hardcoded object:
```tsx
const dummySummary = {
  balance: "$2,450,800.50",
  income: "$553,600.07",
  expense: "$850,000.12",
  savings: "$721,480.13"
}
```

**How to connect:**
You already have the `useSummary` hook imported in `Dashboard.tsx`. Uncomment and use it to pass real values to the `FinaiSummaryCard` components:

```tsx
import { useSummary } from "@/features/analytics/hooks/useSummary"
import { formatCurrency } from "@/lib/utils" // Or your formatting utility

export default function Dashboard() {
  const { data: summary, isLoading } = useSummary(from_date, to_date)

  return (
    // ...
    <FinaiSummaryCard
      title="Total Balance"
      value={isLoading ? "..." : formatCurrency(summary?.balance || 0)}
      change="+5.2%" // You will need to calculate this comparing current vs previous period
      changeType="positive"
      variant="dark"
    />
    // Repeat for Income, Expenses, Savings
  )
}
```

## 2. Spending Overview (`SpendingOverview.tsx`)

This component displays a donut chart and a breakdown of spending by category.

**How to connect:**
Use the `useCategoryState` or an API hook that fetches grouped transactions by category.

```tsx
import { useTransactionState } from "@/features/transactions/store/transactionState"

export default function SpendingOverview() {
  const transactions = useTransactionState(s => s.transactions)
  
  // 1. Filter expenses
  // 2. Group by category and sum amounts
  // 3. Calculate percentages
  // 4. Map to the 'categories' array format expected by the Donut chart

  // Example mapping:
  const categories = Object.values(groupedData).map((cat, index) => ({
     name: cat.name,
     amount: formatCurrency(cat.total),
     percent: `${cat.percentage}%`,
     icon: getCategoryIcon(cat.name),
     fill: getColorForIndex(index), 
     // strokeDasharray and offset require math based on the percentage
     strokeDasharray: `${cat.percentage} 100`,
     strokeDashoffset: calculateOffset(index, percentages)
  }))

  return ( ... )
}
```
*Note for SVG Chart*: To perfectly render the donut slices, you need to calculate `strokeDashoffset` cumulatively. E.g., if Slice 1 is 32%, Slice 2 is 20%. Slice 1 offset is `25` (starting point), Slice 2 offset is `100 - 32 + 25` (simplifying, it's relative rotation).

## 3. Recent Transactions (`FinaiRecentTransactions.tsx`)

This list currently shows hardcoded Starbucks, Deposit, and Uber.

**How to connect:**
Subscribe to your transaction store and slice the first 3-5 items.

```tsx
import { useTransactionState } from "@/features/transactions/store/transactionState"
import { format } from "date-fns"

export default function FinaiRecentTransactions() {
  const transactions = useTransactionState(s => s.transactions).slice(0, 5)

  return (
    // ...
    {transactions.map(tx => (
       <div key={tx.id} className="...">
          {/* Map tx.category to an icon, tx.date to formatted string, tx.amount to string */}
       </div>
    ))}
  )
}
```

## 4. Quick Actions (`QuickActions.tsx`)

The buttons (Send Money, Add Funds) currently don't do anything.

**How to connect:**
Bind them to modal state setters or navigation.

```tsx
<button onClick={() => setAddTransactionModalOpen(true)}>
   {/* UI elements */}
</button>
```

## 5. AI Features (`AiSmartInsight.tsx` & `AiRecommendations.tsx`)

These components currently display static AI-generated text.

**How to connect:**
If you have an actual AI backend (like an OpenAI integration), you will need a hook:
```tsx
const { insight, isLoading } = useSmartInsights()
```
Pass the resulting text to the component. If you don't have an AI backend yet, you can leave the static design as a placeholder for a future feature release.
