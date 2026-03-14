import Link from "next/link";

const reports = [
  {
    title: "GL Trial Balance",
    description:
      "View account balances from posted journal entries, with debit/credit totals.",
    href: "/gl/trial-balance",
  },
  {
    title: "AR Aging Report",
    description:
      "Outstanding receivables grouped by customer and aging bucket (current, 31-60, 61-90, 90+ days).",
    href: "/ar/aging",
  },
  {
    title: "IC Stock Status",
    description:
      "Real-time inventory levels by product and warehouse, including available and reserved quantities.",
    href: "/ic/stock",
  },
  {
    title: "IC Stock Movements",
    description:
      "Inventory transaction history -- receipts, issues, transfers, and adjustments.",
    href: "/ic/movements",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Browse and run financial, inventory, and operational reports.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="group rounded-lg border bg-card p-5 transition-colors hover:border-primary hover:bg-accent"
          >
            <h2 className="font-medium group-hover:text-primary">
              {report.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {report.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
