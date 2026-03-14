"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { UserProfile } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface ColumnActions {
  onEdit: (user: UserProfile) => void;
}

export function getUserColumns({
  onEdit,
}: ColumnActions): ColumnDef<UserProfile>[] {
  return [
    {
      accessorKey: "id",
      header: "User ID",
      cell: ({ row }) => row.original.id.slice(0, 8) + "...",
    },
    {
      accessorKey: "displayName",
      header: "Display Name",
      cell: ({ row }) => row.original.displayName || "—",
    },
    {
      accessorKey: "defaultCompanyCode",
      header: "Default Company",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "—",
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(row.original)}
          >
            <Pencil />
          </Button>
        </div>
      ),
    },
  ];
}
