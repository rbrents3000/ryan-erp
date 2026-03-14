"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/erp/data-table";
import { mrpColumns } from "./columns";
import type { MrpRow } from "./actions";

interface Props {
  data: MrpRow[];
}

export function MrpReport({ data }: Props) {
  const summary = useMemo(() => {
    const totalDemand = data.reduce((sum, r) => sum + r.qtyDemand, 0);
    const totalOnHand = data.reduce((sum, r) => sum + r.qtyOnHand, 0);
    const totalSupply = data.reduce((sum, r) => sum + r.qtySupply, 0);
    const shortageCount = data.filter((r) => r.netRequirement > 0).length;
    return { totalDemand, totalOnHand, totalSupply, shortageCount };
  }, [data]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={mrpColumns}
        data={data}
        searchKey="productName"
        searchPlaceholder="Search by product..."
      />

      <div className="rounded-lg border bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>
            {data.length} product{data.length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-8">
            <span className="tabular-nums">On Hand: {summary.totalOnHand}</span>
            <span className="tabular-nums">Demand: {summary.totalDemand}</span>
            <span className="tabular-nums">Supply: {summary.totalSupply}</span>
            <span
              className={`tabular-nums ${summary.shortageCount > 0 ? "text-red-600 font-bold" : "text-green-600"}`}
            >
              {summary.shortageCount > 0
                ? `${summary.shortageCount} shortage${summary.shortageCount !== 1 ? "s" : ""}`
                : "No shortages"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
