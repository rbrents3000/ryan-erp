"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/erp/data-table";
import { capacityColumns } from "./columns";
import type { CapacityRow } from "./actions";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

interface Props {
  data: CapacityRow[];
}

export function CapacityReport({ data }: Props) {
  const totals = useMemo(() => {
    const totalHours = data.reduce((sum, r) => sum + r.totalHours, 0);
    const totalCost = data.reduce((sum, r) => sum + r.totalCost, 0);
    const totalJobs = data.reduce((sum, r) => sum + r.jobCount, 0);
    return { totalHours, totalCost, totalJobs };
  }, [data]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={capacityColumns}
        data={data}
      />

      <div className="rounded-lg border bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>
            {data.length} week{data.length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-8">
            <span className="tabular-nums">
              Total Jobs: {totals.totalJobs}
            </span>
            <span className="tabular-nums">
              Total Hours: {totals.totalHours.toFixed(1)}
            </span>
            <span className="tabular-nums">
              Total Cost: {formatCurrency(totals.totalCost)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
