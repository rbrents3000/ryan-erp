"use client";

import { useState, useMemo } from "react";
import type { Warehouse } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getWarehouseColumns } from "./columns";
import { WarehouseForm } from "./warehouse-form";
import { deleteWarehouse } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface WarehouseListProps {
  data: Warehouse[];
}

export function WarehouseList({ data }: WarehouseListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);

  const columns = useMemo(
    () =>
      getWarehouseColumns({
        onEdit: (warehouse) => {
          setEditing(warehouse);
          setFormOpen(true);
        },
        onDelete: async (warehouse) => {
          if (confirm(`Delete warehouse "${warehouse.name}"?`)) {
            await deleteWarehouse(warehouse.id);
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
          Add Warehouse
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search warehouses..." />
      <WarehouseForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        warehouse={editing}
      />
    </>
  );
}
