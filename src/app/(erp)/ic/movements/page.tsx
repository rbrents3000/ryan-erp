import { getStockMovements } from "./actions";
import { MovementsReport } from "./movements-report";

interface Props {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}

export default async function StockMovementsPage({ searchParams }: Props) {
  const { startDate, endDate } = await searchParams;
  const data = await getStockMovements(startDate, endDate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stock Movements</h1>
        <p className="text-sm text-muted-foreground">
          Track inventory transactions -- receipts, issues, transfers, and adjustments.
        </p>
      </div>
      <MovementsReport data={data} />
    </div>
  );
}
