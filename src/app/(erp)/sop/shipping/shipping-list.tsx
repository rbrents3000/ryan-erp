"use client";

import { DataTable } from "@/components/erp/data-table";
import { shippingColumns } from "./columns";
import type { ShippingRow } from "./actions";

interface Props {
  data: ShippingRow[];
}

export function ShippingList({ data }: Props) {
  return (
    <div className="space-y-4">
      <DataTable
        columns={shippingColumns}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search by customer..."
      />
    </div>
  );
}
