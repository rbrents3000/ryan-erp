"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { payments } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type Payment = typeof payments.$inferSelect;

interface ColumnActions {
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

export function getPaymentColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Payment>[] {
  return [
    {
      accessorKey: "paymentDate",
      header: "Date",
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.paymentMethod}</span>
      ),
    },
    {
      accessorKey: "checkNumber",
      header: "Check #",
      cell: ({ row }) => row.original.checkNumber || "\u2014",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.original.amount);
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: row.original.currencyCode || "USD",
        }).format(amount);
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
