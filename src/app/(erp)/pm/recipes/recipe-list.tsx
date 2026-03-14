"use client";

import { useState, useMemo } from "react";
import type { Recipe } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getRecipeColumns } from "./columns";
import { RecipeForm } from "./recipe-form";
import { deleteRecipe } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface RecipeListProps {
  data: Recipe[];
}

export function RecipeList({ data }: RecipeListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);

  const columns = useMemo(
    () =>
      getRecipeColumns({
        onEdit: (recipe) => {
          setEditing(recipe);
          setFormOpen(true);
        },
        onDelete: async (recipe) => {
          if (confirm(`Delete recipe "${recipe.name}"?`)) {
            await deleteRecipe(recipe.id);
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
          Add Recipe
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search recipes..." />
      <RecipeForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        recipe={editing}
      />
    </>
  );
}
