"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { goodsReceived } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type GoodsReceivedNote = typeof goodsReceived.$inferSelect;

interface ColumnActions {
  onEdit: (item: GoodsReceivedNote) => void;
  onDelete: (item: GoodsReceivedNote) => void;
}

export function getGoodsReceivedColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<GoodsReceivedNote>[] {
  return [
    {
      accessorKey: "grnNumber",
      header: "GRN #",
    },
    {
      accessorKey: "poHeaderId",
      header: "PO",
      cell: ({ row }) => row.original.poHeaderId.slice(0, 8) + "...",
    },
    {
      accessorKey: "vendorId",
      header: "Vendor",
      cell: ({ row }) => row.original.vendorId.slice(0, 8) + "...",
    },
    {
      accessorKey: "receivedDate",
      header: "Received Date",
    },
    {
      accessorKey: "warehouseId",
      header: "Warehouse",
      cell: ({ row }) => row.original.warehouseId.slice(0, 8) + "...",
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
