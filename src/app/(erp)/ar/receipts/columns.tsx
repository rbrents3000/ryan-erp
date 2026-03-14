"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { cashReceipts } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type CashReceipt = typeof cashReceipts.$inferSelect;

interface ColumnActions {
  onEdit: (receipt: CashReceipt) => void;
  onDelete: (receipt: CashReceipt) => void;
}

export function getReceiptColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<CashReceipt>[] {
  return [
    {
      accessorKey: "receiptDate",
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
      accessorKey: "referenceNumber",
      header: "Reference",
      cell: ({ row }) => row.original.referenceNumber || "\u2014",
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
