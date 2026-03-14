"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/erp/data-table";
import { movementColumns } from "./columns";
import type { StockMovementRow } from "./actions";

interface Props {
  data: StockMovementRow[];
}

export function MovementsReport({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/ic/movements?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/ic/movements");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => updateParams("startDate", e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <label className="text-sm font-medium">To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => updateParams("endDate", e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        {(startDate || endDate) && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <DataTable
        columns={movementColumns}
        data={data}
        searchKey="productName"
        searchPlaceholder="Search by product name..."
      />

      <div className="rounded-lg border bg-muted/30 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {data.length} movement{data.length !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
}
