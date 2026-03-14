"use client";

import { useState, useMemo } from "react";
import type { Vendor } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getVendorColumns } from "./columns";
import { VendorForm } from "./vendor-form";
import { deleteVendor } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface VendorListProps {
  data: Vendor[];
}

export function VendorList({ data }: VendorListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);

  const columns = useMemo(
    () =>
      getVendorColumns({
        onEdit: (vendor) => {
          setEditing(vendor);
          setFormOpen(true);
        },
        onDelete: async (vendor) => {
          if (confirm(`Delete vendor "${vendor.name}"?`)) {
            await deleteVendor(vendor.id);
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
          Add Vendor
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search vendors..." />
      <VendorForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        vendor={editing}
      />
    </>
  );
}
