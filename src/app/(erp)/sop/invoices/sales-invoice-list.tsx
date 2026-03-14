"use client";

import { DataTable } from "@/components/erp/data-table";
import { salesInvoiceColumns } from "./columns";
import type { SalesInvoiceRow } from "./actions";

interface Props {
  data: SalesInvoiceRow[];
}

export function SalesInvoiceList({ data }: Props) {
  return (
    <div className="space-y-4">
      <DataTable
        columns={salesInvoiceColumns}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search by customer..."
      />
    </div>
  );
}
