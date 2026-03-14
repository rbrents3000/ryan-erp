"use client";

import { useState, useMemo } from "react";
import type { UnitOfMeasure } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getUomColumns } from "./columns";
import { UomForm } from "./uom-form";
import { deleteUom } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface UomListProps {
  data: UnitOfMeasure[];
}

export function UomList({ data }: UomListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UnitOfMeasure | null>(null);

  const columns = useMemo(
    () =>
      getUomColumns({
        onEdit: (uom) => { setEditing(uom); setFormOpen(true); },
        onDelete: async (uom) => {
          if (confirm(`Delete UOM "${uom.code}"?`)) {
            await deleteUom(uom.id);
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
          <Plus className="size-4" /> Add UOM
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="code" searchPlaceholder="Search units..." />
      <UomForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditing(null); }}
        uom={editing}
      />
    </>
  );
}
