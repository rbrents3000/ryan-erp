"use client";

import { DataTable } from "@/components/erp/data-table";
import { scheduleColumns } from "./columns";
import type { ScheduleRow } from "./actions";

interface Props {
  data: ScheduleRow[];
}

export function ScheduleList({ data }: Props) {
  return (
    <div className="space-y-4">
      <DataTable
        columns={scheduleColumns}
        data={data}
        searchKey="jobNumber"
        searchPlaceholder="Search by job number..."
      />
    </div>
  );
}
