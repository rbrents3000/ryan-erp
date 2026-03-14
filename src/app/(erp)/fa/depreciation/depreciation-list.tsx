"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/erp/data-table";
import { getDepreciationColumns } from "./columns";
import type { DepreciationEntryWithAsset } from "./actions";

interface DepreciationListProps {
  data: DepreciationEntryWithAsset[];
}

export function DepreciationList({ data }: DepreciationListProps) {
  const columns = useMemo(() => getDepreciationColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="assetName"
      searchPlaceholder="Search by asset name..."
    />
  );
}
