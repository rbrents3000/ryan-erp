import { getStockStatus } from "./actions";
import { StockStatusReport } from "./stock-status-report";

export default async function StockStatusPage() {
  const data = await getStockStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stock Status</h1>
        <p className="text-sm text-muted-foreground">
          View real-time inventory levels by product and warehouse.
        </p>
      </div>
      <StockStatusReport data={data} />
    </div>
  );
}
