"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { DepreciationEntryWithAsset } from "./actions";

export function getDepreciationColumns(): ColumnDef<DepreciationEntryWithAsset>[] {
  return [
    {
      accessorKey: "assetNumber",
      header: "Asset #",
    },
    {
      accessorKey: "assetName",
      header: "Asset Name",
    },
    {
      accessorKey: "depreciationDate",
      header: "Date",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) =>
        parseFloat(row.original.amount).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      accessorKey: "accumulatedTotal",
      header: "Accumulated Total",
      cell: ({ row }) =>
        parseFloat(row.original.accumulatedTotal).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
  ];
}
