"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Asset } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export function getAssetColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Asset>[] {
  return [
    {
      accessorKey: "assetNumber",
      header: "Asset #",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.original.category || "—",
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => row.original.location || "—",
    },
    {
      accessorKey: "acquisitionDate",
      header: "Acquisition Date",
    },
    {
      accessorKey: "acquisitionCost",
      header: "Cost",
      cell: ({ row }) =>
        parseFloat(row.original.acquisitionCost).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      accessorKey: "netBookValue",
      header: "Net Book Value",
      cell: ({ row }) =>
        parseFloat(row.original.netBookValue).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(row.original)}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];
}
