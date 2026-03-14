"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { despatchNotes } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type DespatchNote = typeof despatchNotes.$inferSelect;

interface ColumnActions {
  onEdit: (item: DespatchNote) => void;
  onDelete: (item: DespatchNote) => void;
}

export function getDespatchColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<DespatchNote>[] {
  return [
    {
      accessorKey: "despatchNumber",
      header: "Despatch #",
    },
    {
      accessorKey: "orderId",
      header: "Order",
      cell: ({ row }) => row.original.orderId.slice(0, 8) + "...",
    },
    {
      accessorKey: "customerId",
      header: "Customer",
      cell: ({ row }) => row.original.customerId.slice(0, 8) + "...",
    },
    {
      accessorKey: "despatchDate",
      header: "Date",
    },
    {
      accessorKey: "carrier",
      header: "Carrier",
      cell: ({ row }) => row.original.carrier || "—",
    },
    {
      accessorKey: "trackingNumber",
      header: "Tracking #",
      cell: ({ row }) => row.original.trackingNumber || "—",
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
