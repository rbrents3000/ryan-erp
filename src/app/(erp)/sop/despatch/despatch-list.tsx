"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { despatchNotes } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getDespatchColumns } from "./columns";
import { DespatchForm } from "./despatch-form";
import { deleteDespatchNote } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type DespatchNote = typeof despatchNotes.$inferSelect;

interface DespatchListProps {
  data: DespatchNote[];
}

export function DespatchList({ data }: DespatchListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DespatchNote | null>(null);

  const columns = useMemo(
    () =>
      getDespatchColumns({
        onEdit: (item) => {
          setEditing(item);
          setFormOpen(true);
        },
        onDelete: async (item) => {
          if (confirm("Delete this despatch note?")) {
            await deleteDespatchNote(item.id);
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
          New Despatch Note
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="despatchNumber"
        searchPlaceholder="Search by despatch #..."
      />
      <DespatchForm
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
