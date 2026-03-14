"use client";

import { useState, useMemo } from "react";
import type { ApInvoice } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getInvoiceColumns } from "./columns";
import { InvoiceForm } from "./invoice-form";
import { deleteApInvoice } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface InvoiceListProps {
  data: ApInvoice[];
}

export function InvoiceList({ data }: InvoiceListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ApInvoice | null>(null);

  const columns = useMemo(
    () =>
      getInvoiceColumns({
        onEdit: (invoice) => {
          setEditing(invoice);
          setFormOpen(true);
        },
        onDelete: async (invoice) => {
          if (confirm(`Delete invoice "${invoice.invoiceNumber}"?`)) {
            await deleteApInvoice(invoice.id);
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
          New Invoice
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="invoiceNumber"
        searchPlaceholder="Search invoices..."
      />
      <InvoiceForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        invoice={editing}
      />
    </>
  );
}
