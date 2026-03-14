import { listVendors } from "./actions";
import { VendorList } from "./vendor-list";

export default async function VendorsPage() {
  const vendors = await listVendors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Vendors</h1>
        <p className="text-sm text-muted-foreground">
          Manage vendor records and supplier information.
        </p>
      </div>
      <VendorList data={vendors} />
    </div>
  );
}
