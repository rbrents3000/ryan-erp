"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/erp/data-table";
import { getParameterColumns } from "./columns";
import { ParameterForm } from "./parameter-form";
import { deleteParameter } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type Parameter = {
  id: string;
  tenantId: string;
  companyCode: string | null;
  key: string;
  value: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface ParameterListProps {
  data: Parameter[];
}

export function ParameterList({ data }: ParameterListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Parameter | null>(null);

  const columns = useMemo(
    () =>
      getParameterColumns({
        onEdit: (param) => { setEditing(param); setFormOpen(true); },
        onDelete: async (param) => {
          if (confirm(`Delete parameter "${param.key}"?`)) {
            await deleteParameter(param.id);
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
          <Plus className="size-4" /> Add Parameter
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="key" searchPlaceholder="Search parameters..." />
      <ParameterForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditing(null); }}
        parameter={editing}
      />
    </>
  );
}
