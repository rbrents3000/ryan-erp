"use client";

import { useState, useMemo } from "react";
import type { Job } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getJobColumns } from "./columns";
import { JobForm } from "./job-form";
import { deleteJob } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface JobListProps {
  data: Job[];
}

export function JobList({ data }: JobListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);

  const columns = useMemo(
    () =>
      getJobColumns({
        onEdit: (job) => {
          setEditing(job);
          setFormOpen(true);
        },
        onDelete: async (job) => {
          if (confirm(`Delete job "${job.jobNumber}"?`)) {
            await deleteJob(job.id);
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
          New Job
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="jobNumber" searchPlaceholder="Search jobs..." />
      <JobForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        job={editing}
      />
    </>
  );
}
