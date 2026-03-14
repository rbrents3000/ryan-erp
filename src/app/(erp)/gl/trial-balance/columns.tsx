"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TrialBalanceRow } from "./actions";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export const trialBalanceColumns: ColumnDef<TrialBalanceRow>[] = [
  {
    accessorKey: "accountNumber",
    header: "Account #",
  },
  {
    accessorKey: "accountName",
    header: "Account Name",
  },
  {
    accessorKey: "accountType",
    header: "Type",
    cell: ({ row }) => {
      const t = row.original.accountType;
      return t.charAt(0).toUpperCase() + t.slice(1);
    },
  },
  {
    accessorKey: "totalDebit",
    header: "Debits",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.totalDebit)}
      </span>
    ),
  },
  {
    accessorKey: "totalCredit",
    header: "Credits",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.totalCredit)}
      </span>
    ),
  },
  {
    accessorKey: "netBalance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.original.netBalance;
      return (
        <span
          className={`tabular-nums font-medium ${balance < 0 ? "text-red-600" : ""}`}
        >
          {formatCurrency(balance)}
        </span>
      );
    },
  },
];
