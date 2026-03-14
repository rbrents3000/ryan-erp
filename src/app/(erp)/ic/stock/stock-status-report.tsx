"use client";

import { DataTable } from "@/components/erp/data-table";
import { stockStatusColumns } from "./columns";
import type { StockStatusRow } from "./actions";

interface Props {
  data: StockStatusRow[];
}

export function StockStatusReport({ data }: Props) {
  return (
    <div className="space-y-4">
      <DataTable
        columns={stockStatusColumns}
        data={data}
        searchKey="productName"
        searchPlaceholder="Search by product name or part number..."
      />
    </div>
  );
}
