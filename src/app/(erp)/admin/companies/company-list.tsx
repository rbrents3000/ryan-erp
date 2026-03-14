"use client";

import { useState, useMemo } from "react";
import type { Company } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getCompanyColumns } from "./columns";
import { CompanyForm } from "./company-form";
import { deleteCompany } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CompanyListProps {
  data: Company[];
}

export function CompanyList({ data }: CompanyListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const columns = useMemo(
    () =>
      getCompanyColumns({
        onEdit: (company) => {
          setEditing(company);
          setFormOpen(true);
        },
        onDelete: async (company) => {
          if (confirm(`Delete company "${company.name}"?`)) {
            await deleteCompany(company.id);
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
          Add Company
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search companies..." />
      <CompanyForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        company={editing}
      />
    </>
  );
}
