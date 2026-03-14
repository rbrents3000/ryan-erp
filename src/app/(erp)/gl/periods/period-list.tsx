"use client";

import { useState, useMemo, useEffect } from "react";
import type { Period } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getPeriodColumns } from "./columns";
import { PeriodForm } from "./period-form";
import { deletePeriod, listPeriods } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "@/lib/stores/company-store";

interface PeriodListProps {
  initialData: Period[];
  initialCompanyCode: string;
}

export function PeriodList({ initialData, initialCompanyCode }: PeriodListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Period | null>(null);
  const [data, setData] = useState(initialData);
  const { companyCode } = useCompanyStore();
  const activeCompany = companyCode ?? initialCompanyCode;

  useEffect(() => {
    if (activeCompany !== initialCompanyCode) {
      listPeriods(activeCompany).then(setData);
    }
  }, [activeCompany, initialCompanyCode]);

  const columns = useMemo(
    () =>
      getPeriodColumns({
        onEdit: (period) => { setEditing(period); setFormOpen(true); },
        onDelete: async (period) => {
          if (confirm(`Delete period ${period.fiscalYear}-${period.periodNum}?`)) {
            await deletePeriod(period.id);
            router.refresh();
            listPeriods(activeCompany).then(setData);
          }
        },
      }),
    [router, activeCompany]
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing periods for company <span className="font-medium">{activeCompany}</span>
        </p>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="size-4" /> Add Period
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="fiscalYear" searchPlaceholder="Search by year..." />
      <PeriodForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditing(null); }}
        period={editing}
        companyCode={activeCompany}
      />
    </>
  );
}
