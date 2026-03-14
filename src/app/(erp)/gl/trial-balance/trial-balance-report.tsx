"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/erp/data-table";
import { trialBalanceColumns } from "./columns";
import type { TrialBalanceRow } from "./actions";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

interface Props {
  data: TrialBalanceRow[];
}

export function TrialBalanceReport({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const asOfDate = searchParams.get("asOfDate") ?? "";

  const totals = useMemo(() => {
    const totalDebit = data.reduce((sum, r) => sum + r.totalDebit, 0);
    const totalCredit = data.reduce((sum, r) => sum + r.totalCredit, 0);
    const net = totalDebit - totalCredit;
    return { totalDebit, totalCredit, net };
  }, [data]);

  const isBalanced = Math.abs(totals.net) < 0.005;

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("asOfDate", val);
    } else {
      params.delete("asOfDate");
    }
    router.push(`/gl/trial-balance?${params.toString()}`);
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
              router.push(`/gl/trial-balance?${params.toString()}`);
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <DataTable
        columns={trialBalanceColumns}
        data={data}
        searchKey="accountName"
        searchPlaceholder="Search accounts..."
      />

      <div className="rounded-lg border bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>
            Totals ({data.length} account{data.length !== 1 ? "s" : ""})
          </span>
          <div className="flex gap-8">
            <span className="tabular-nums">
              Debits: {formatCurrency(totals.totalDebit)}
            </span>
            <span className="tabular-nums">
              Credits: {formatCurrency(totals.totalCredit)}
            </span>
            <span
              className={`tabular-nums ${isBalanced ? "text-green-600" : "text-red-600 font-bold"}`}
            >
              {isBalanced ? "Balanced" : `Out of balance: ${formatCurrency(totals.net)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
