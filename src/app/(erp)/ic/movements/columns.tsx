"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { StockMovementRow } from "./actions";

function formatQty(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export const movementColumns: ColumnDef<StockMovementRow>[] = [
  {
    accessorKey: "movementDate",
    header: "Date",
  },
  {
    accessorKey: "partNumber",
    header: "Part #",
  },
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "warehouseCode",
    header: "Warehouse",
  },
  {
    accessorKey: "movementType",
    header: "Type",
    cell: ({ row }) => {
      const t = row.original.movementType;
      return t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, " ");
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const val = row.original.quantity;
      return (
        <span className={`tabular-nums ${val < 0 ? "text-red-600" : ""}`}>
          {formatQty(val)}
        </span>
      );
    },
  },
  {
    accessorKey: "referenceType",
    header: "Ref Type",
    cell: ({ row }) => row.original.referenceType ?? "-",
  },
  {
    accessorKey: "referenceId",
    header: "Ref ID",
    cell: ({ row }) => {
      const id = row.original.referenceId;
      return id ? id.substring(0, 8) + "..." : "-";
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => row.original.notes ?? "-",
  },
];
