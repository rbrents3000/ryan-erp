"use client";

import { useState, useMemo } from "react";
import type { PoHeader } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getPoOrderColumns } from "./columns";
import { PoOrderForm } from "./order-form";
import { deletePoOrder } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface PoOrderListProps {
  data: PoHeader[];
}

export function PoOrderList({ data }: PoOrderListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PoHeader | null>(null);

  const columns = useMemo(
    () =>
      getPoOrderColumns({
        onEdit: (po) => {
          setEditing(po);
          setFormOpen(true);
        },
        onDelete: async (po) => {
          if (confirm(`Delete PO "${po.poNumber}"?`)) {
            await deletePoOrder(po.id);
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
          New PO
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="poNumber"
        searchPlaceholder="Search purchase orders..."
      />
      <PoOrderForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        poHeader={editing}
      />
    </>
  );
}
