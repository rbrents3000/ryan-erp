import { listShipments } from "./actions";
import { ShippingList } from "./shipping-list";

export default async function ShippingPage() {
  const data = await listShipments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Shipping</h1>
        <p className="text-sm text-muted-foreground">
          Track shipments and carrier information for despatched orders.
        </p>
      </div>
      <ShippingList data={data} />
    </div>
  );
}
