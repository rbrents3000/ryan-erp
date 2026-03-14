"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getProductColumns } from "./columns";
import { ProductForm } from "./product-form";
import { deleteProduct } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductListProps {
  data: Product[];
}

export function ProductList({ data }: ProductListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const columns = useMemo(
    () =>
      getProductColumns({
        onEdit: (product) => {
          setEditing(product);
          setFormOpen(true);
        },
        onDelete: async (product) => {
          if (confirm(`Delete product "${product.name}"?`)) {
            await deleteProduct(product.id);
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
          Add Product
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="partNumber" searchPlaceholder="Search products..." />
      <ProductForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        product={editing}
      />
    </>
  );
}
