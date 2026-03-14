"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { jobLabor } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getTimeCardColumns } from "./columns";
import { TimeCardForm } from "./time-card-form";
import { deleteTimeCard } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type TimeCard = typeof jobLabor.$inferSelect;

interface TimeCardListProps {
  data: TimeCard[];
}

export function TimeCardList({ data }: TimeCardListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TimeCard | null>(null);

  const columns = useMemo(
    () =>
      getTimeCardColumns({
        onEdit: (item) => {
          setEditing(item);
          setFormOpen(true);
        },
        onDelete: async (item) => {
          if (confirm("Delete this time card?")) {
            await deleteTimeCard(item.id);
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
          New Time Card
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="employeeName"
        searchPlaceholder="Search by employee..."
      />
      <TimeCardForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        editing={editing}
        onSuccess={() => {
          setFormOpen(false);
          setEditing(null);
          router.refresh();
        }}
      />
    </>
  );
}
