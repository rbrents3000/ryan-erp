"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Asset } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getAssetColumns } from "./columns";
import { AssetForm } from "./asset-form";
import { deleteAsset } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AssetListProps {
  data: Asset[];
}

export function AssetList({ data }: AssetListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);

  const columns = useMemo(
    () =>
      getAssetColumns({
        onEdit: (asset) => {
          setEditing(asset);
          setFormOpen(true);
        },
        onDelete: async (asset) => {
          if (confirm(`Delete asset "${asset.name}"?`)) {
            await deleteAsset(asset.id);
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
          Add Asset
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search assets..."
      />
      <AssetForm
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
