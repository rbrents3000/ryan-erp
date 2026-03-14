"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getUserColumns } from "./columns";
import { UserProfileForm } from "./user-profile-form";

interface UserProfileListProps {
  data: UserProfile[];
}

export function UserProfileList({ data }: UserProfileListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserProfile | null>(null);

  const columns = useMemo(
    () =>
      getUserColumns({
        onEdit: (user) => {
          setEditing(user);
          setFormOpen(true);
        },
      }),
    []
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="displayName"
        searchPlaceholder="Search users..."
      />
      <UserProfileForm
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
