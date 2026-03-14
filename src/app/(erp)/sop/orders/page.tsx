import { listOrders } from "./actions";
import { OrderList } from "./order-list";

export default async function SalesOrdersPage() {
  const data = await listOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sales Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage customer sales orders.
        </p>
      </div>
      <OrderList data={data} />
    </div>
  );
}
