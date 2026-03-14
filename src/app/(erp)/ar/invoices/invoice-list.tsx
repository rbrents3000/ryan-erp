"use client";

import { useState, useMemo } from "react";
import type { ArInvoice } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getInvoiceColumns } from "./columns";
import { InvoiceForm } from "./invoice-form";
import { deleteArInvoice } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface InvoiceListProps {
  data: ArInvoice[];
}

export function InvoiceList({ data }: InvoiceListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ArInvoice | null>(null);

  const columns = useMemo(
    () =>
      getInvoiceColumns({
        onEdit: (invoice) => {
          setEditing(invoice);
          setFormOpen(true);
        },
        onDelete: async (invoice) => {
          if (confirm(`Delete invoice "${invoice.invoiceNumber}"?`)) {
            await deleteArInvoice(invoice.id);
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
