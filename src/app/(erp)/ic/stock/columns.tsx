"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { StockStatusRow } from "./actions";

function formatQty(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export const stockStatusColumns: ColumnDef<StockStatusRow>[] = [
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
    accessorKey: "warehouseName",
    header: "Warehouse Name",
  },
  {
    accessorKey: "qtyOnHand",
    header: "On Hand",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatQty(row.original.qtyOnHand)}</span>
    ),
  },
  {
    accessorKey: "qtyReserved",
    header: "Reserved",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatQty(row.original.qtyReserved)}</span>
    ),
  },
  {
    accessorKey: "qtyOnOrder",
    header: "On Order",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatQty(row.original.qtyOnOrder)}</span>
    ),
  },
  {
    accessorKey: "available",
    header: "Available",
    cell: ({ row }) => {
      const val = row.original.available;
      const reorder = row.original.reorderPoint;
      const belowReorder = reorder != null && val <= reorder;
      return (
        <span
          className={`tabular-nums font-medium ${belowReorder ? "text-red-600" : ""}`}
        >
          {formatQty(val)}
        </span>
      );
    },
  },
  {
    accessorKey: "reorderPoint",
    header: "Reorder Pt",
    cell: ({ row }) => {
      const val = row.original.reorderPoint;
      return (
        <span className="tabular-nums">{val != null ? formatQty(val) : "-"}</span>
      );
    },
  },
  {
    accessorKey: "binLocation",
    header: "Bin",
    cell: ({ row }) => row.original.binLocation ?? "-",
  },
];
