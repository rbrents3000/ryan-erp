import { listWarehouses } from "./actions";
import { WarehouseList } from "./warehouse-list";

export default async function WarehousesPage() {
  const warehouses = await listWarehouses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Warehouses</h1>
        <p className="text-sm text-muted-foreground">
          Manage warehouse locations and inventory storage.
        </p>
      </div>
      <WarehouseList data={warehouses} />
    </div>
  );
}
