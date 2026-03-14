"use client";

import { useState, useMemo } from "react";
import type { GlAccount } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getAccountColumns } from "./columns";
import { AccountForm } from "./account-form";
import { deleteGlAccount } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface GlAccountListProps {
  data: GlAccount[];
}

export function GlAccountList({ data }: GlAccountListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GlAccount | null>(null);

  const columns = useMemo(
    () =>
      getAccountColumns({
        onEdit: (account) => {
          setEditing(account);
          setFormOpen(true);
        },
        onDelete: async (account) => {
          if (confirm(`Delete account "${account.name}"?`)) {
            await deleteGlAccount(account.id);
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
          Add Account
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search accounts..." />
      <AccountForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        account={editing}
      />
    </>
  );
}
