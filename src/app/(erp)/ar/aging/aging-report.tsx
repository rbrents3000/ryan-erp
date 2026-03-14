"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/erp/data-table";
import { agingColumns } from "./columns";
import type { AgingRow } from "./actions";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

interface Props {
  data: AgingRow[];
}

export function AgingReport({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const asOfDate = searchParams.get("asOfDate") ?? "";

  const totals = useMemo(() => {
    const current = data.reduce((sum, r) => sum + r.current, 0);
    const days31to60 = data.reduce((sum, r) => sum + r.days31to60, 0);
    const days61to90 = data.reduce((sum, r) => sum + r.days61to90, 0);
    const days90plus = data.reduce((sum, r) => sum + r.days90plus, 0);
    const total = data.reduce((sum, r) => sum + r.total, 0);
    return { current, days31to60, days61to90, days90plus, total };
  }, [data]);

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("asOfDate", val);
    } else {
      params.delete("asOfDate");
    }
    router.push(`/ar/aging?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">As of date</label>
        <input
          type="date"
          value={asOfDate}
          onChange={handleDateChange}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        {asOfDate && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("asOfDate");
              router.push(`/ar/aging?${params.toString()}`);
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <DataTable
        columns={agingColumns}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search customers..."
      />

      <div className="rounded-lg border bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>
            Totals ({data.length} customer{data.length !== 1 ? "s" : ""})
          </span>
          <div className="flex gap-6">
            <span className="tabular-nums">
              Current: {formatCurrency(totals.current)}
            </span>
            <span className="tabular-nums">
              31-60: {formatCurrency(totals.days31to60)}
            </span>
            <span className="tabular-nums">
              61-90: {formatCurrency(totals.days61to90)}
            </span>
            <span className={`tabular-nums ${totals.days90plus > 0 ? "text-red-600" : ""}`}>
              90+: {formatCurrency(totals.days90plus)}
            </span>
            <span className="tabular-nums font-bold">
              Total: {formatCurrency(totals.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
