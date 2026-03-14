"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ApInvoice } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (invoice: ApInvoice) => void;
  onDelete: (invoice: ApInvoice) => void;
}

const statusColors: Record<string, string> = {
  open: "text-blue-600",
  paid: "text-green-600",
  partial: "text-yellow-600",
  cancelled: "text-red-600",
};

export function getInvoiceColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<ApInvoice>[] {
  return [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
    },
    {
      accessorKey: "invoiceDate",
      header: "Date",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => {
        const amount = parseFloat(row.original.totalAmount);
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: row.original.currencyCode || "USD",
        }).format(amount);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color = statusColors[status] ?? "text-muted-foreground";
        return (
          <span className={`font-medium capitalize ${color}`}>{status}</span>
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
