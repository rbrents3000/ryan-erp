import { listPoOrders } from "./actions";
import { PoOrderList } from "./order-list";

export default async function PurchaseOrdersPage() {
  const data = await listPoOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Purchase Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage vendor purchase orders.
        </p>
      </div>
      <PoOrderList data={data} />
    </div>
  );
}
