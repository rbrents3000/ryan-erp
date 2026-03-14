"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ShippingRow } from "./actions";

export const shippingColumns: ColumnDef<ShippingRow>[] = [
  {
    accessorKey: "despatchNumber",
    header: "Despatch #",
  },
  {
    accessorKey: "despatchDate",
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
    accessorKey: "carrier",
    header: "Carrier",
    cell: ({ row }) => row.original.carrier ?? "-",
  },
  {
    accessorKey: "trackingNumber",
    header: "Tracking #",
    cell: ({ row }) => row.original.trackingNumber ?? "-",
  },
];
