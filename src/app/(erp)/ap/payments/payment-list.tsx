"use client";

import { useState, useMemo } from "react";
import type { payments } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getPaymentColumns } from "./columns";
import { PaymentForm } from "./payment-form";
import { deletePayment } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type Payment = typeof payments.$inferSelect;

interface PaymentListProps {
  data: Payment[];
}

export function PaymentList({ data }: PaymentListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);

  const columns = useMemo(
    () =>
      getPaymentColumns({
        onEdit: (payment) => {
          setEditing(payment);
          setFormOpen(true);
        },
        onDelete: async (payment) => {
          if (confirm("Delete this payment?")) {
            await deletePayment(payment.id);
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
          New Payment
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="checkNumber"
        searchPlaceholder="Search payments..."
      />
      <PaymentForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        payment={editing}
      />
    </>
  );
}
