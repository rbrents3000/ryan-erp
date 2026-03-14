"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesInvoiceRow } from "./actions";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const statusColors: Record<string, string> = {
  open: "text-blue-600",
  paid: "text-green-600",
  partial: "text-yellow-600",
  cancelled: "text-red-600",
};

export const salesInvoiceColumns: ColumnDef<SalesInvoiceRow>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
  },
  {
    accessorKey: "invoiceDate",
    header: "Date",
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <span>
        {row.original.customerNumber} - {row.original.customerName}
      </span>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.totalAmount)}
      </span>
    ),
  },
  {
    accessorKey: "balanceDue",
    header: "Balance Due",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.balanceDue)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const colorClass = statusColors[status] ?? "text-muted-foreground";
      return (
        <span className={`font-medium capitalize ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
];
