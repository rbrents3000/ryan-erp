"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { MrpRow } from "./actions";

export const mrpColumns: ColumnDef<MrpRow>[] = [
  {
    accessorKey: "partNumber",
    header: "Part #",
  },
  {
    accessorKey: "productName",
    header: "Product",
  },
  {
    accessorKey: "qtyOnHand",
    header: "On Hand",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.qtyOnHand}</span>
    ),
  },
  {
    accessorKey: "qtyDemand",
    header: "Demand",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.qtyDemand}</span>
    ),
  },
  {
    accessorKey: "qtySupply",
    header: "Supply",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.qtySupply}</span>
    ),
  },
  {
    accessorKey: "netRequirement",
    header: "Net Requirement",
    cell: ({ row }) => {
      const net = row.original.netRequirement;
      return (
        <span
          className={`tabular-nums font-medium ${net > 0 ? "text-red-600" : ""}`}
        >
          {net}
        </span>
      );
    },
  },
];
