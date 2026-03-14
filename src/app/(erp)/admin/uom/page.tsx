import { listUom } from "./actions";
import { UomList } from "./uom-list";

export default async function UomPage() {
  const uom = await listUom();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Units of Measure</h1>
        <p className="text-sm text-muted-foreground">
          Manage unit of measure codes used across the system.
        </p>
      </div>
      <UomList data={uom} />
    </div>
  );
}
