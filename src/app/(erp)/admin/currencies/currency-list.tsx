"use client";

import { useState, useMemo } from "react";
import type { Currency } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getCurrencyColumns } from "./columns";
import { CurrencyForm } from "./currency-form";
import { deleteCurrency } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CurrencyListProps {
  data: Currency[];
}

export function CurrencyList({ data }: CurrencyListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Currency | null>(null);

  const columns = useMemo(
    () =>
      getCurrencyColumns({
        onEdit: (currency) => {
          setEditing(currency);
          setFormOpen(true);
        },
        onDelete: async (currency) => {
          if (confirm(`Delete currency "${currency.code}"?`)) {
            await deleteCurrency(currency.id);
            router.refresh();
          }
        },
      }),
    [router]
  );

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="size-4" /> Add Currency
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="code" searchPlaceholder="Search currencies..." />
      <CurrencyForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditing(null); }}
        currency={editing}
      />
    </>
  );
}
