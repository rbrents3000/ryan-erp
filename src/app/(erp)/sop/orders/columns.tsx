"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const statusColors: Record<string, string> = {
  draft: "text-yellow-600",
  approved: "text-blue-600",
  sent: "text-blue-600",
  received: "text-green-600",
  closed: "text-gray-600",
  cancelled: "text-red-600",
};

export function getOrderColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "orderNumber",
      header: "Order #",
    },
    {
      accessorKey: "orderDate",
      header: "Date",
    },
    {
      accessorKey: "requiredDate",
      header: "Required",
      cell: ({ row }) => row.original.requiredDate ?? "—",
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => {
        const amount = parseFloat(row.original.totalAmount) || 0;
        return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={statusColors[status] ?? "text-gray-600"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
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
