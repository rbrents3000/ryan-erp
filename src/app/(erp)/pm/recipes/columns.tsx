"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Recipe } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ColumnActions {
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

export function getRecipeColumns({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Recipe>[] {
  return [
    {
      accessorKey: "recipeCode",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "outputQuantity",
      header: "Output Qty",
    },
    {
      accessorKey: "outputUom",
      header: "UoM",
    },
    {
      accessorKey: "status",
      header: "Status",
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
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];
}
