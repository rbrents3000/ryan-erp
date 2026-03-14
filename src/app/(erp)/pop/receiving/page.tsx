import { listGoodsReceived } from "./actions";
import { GoodsReceivedList } from "./goods-received-list";

export default async function GoodsReceivingPage() {
  const data = await listGoodsReceived();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Goods Receiving</h1>
        <p className="text-sm text-muted-foreground">
          Receive goods against purchase orders and record deliveries.
        </p>
      </div>
      <GoodsReceivedList data={data} />
    </div>
  );
}
