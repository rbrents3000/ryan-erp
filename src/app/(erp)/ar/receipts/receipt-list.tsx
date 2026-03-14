"use client";

import { useState, useMemo } from "react";
import type { cashReceipts } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getReceiptColumns } from "./columns";
import { ReceiptForm } from "./receipt-form";
import { deleteReceipt } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type CashReceipt = typeof cashReceipts.$inferSelect;

interface ReceiptListProps {
  data: CashReceipt[];
}

export function ReceiptList({ data }: ReceiptListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CashReceipt | null>(null);

  const columns = useMemo(
    () =>
      getReceiptColumns({
        onEdit: (receipt) => {
          setEditing(receipt);
          setFormOpen(true);
        },
        onDelete: async (receipt) => {
          if (confirm("Delete this receipt?")) {
            await deleteReceipt(receipt.id);
            router.refresh();
          }
        },
      }),
    [router]
  );

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          New Receipt
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="referenceNumber"
        searchPlaceholder="Search receipts..."
      />
      <ReceiptForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        receipt={editing}
      />
    </>
  );
}
