"use client";

import { useState, useMemo } from "react";
import type { JournalHeader } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getJournalColumns } from "./columns";
import { JournalForm } from "./journal-form";
import { deleteJournal } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface JournalListProps {
  data: JournalHeader[];
}

export function JournalList({ data }: JournalListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<JournalHeader | null>(null);

  const columns = useMemo(
    () =>
      getJournalColumns({
        onEdit: (journal) => {
          setEditing(journal);
          setFormOpen(true);
        },
        onDelete: async (journal) => {
          if (confirm(`Delete journal #${journal.journalNumber}?`)) {
            await deleteJournal(journal.id);
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
          New Journal
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="description" searchPlaceholder="Search journals..." />
      <JournalForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        journal={editing}
      />
    </>
  );
}
