"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { goodsReceived } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getGoodsReceivedColumns } from "./columns";
import { GoodsReceivedForm } from "./goods-received-form";
import { deleteGoodsReceived } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type GoodsReceivedNote = typeof goodsReceived.$inferSelect;

interface GoodsReceivedListProps {
  data: GoodsReceivedNote[];
}

export function GoodsReceivedList({ data }: GoodsReceivedListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GoodsReceivedNote | null>(null);

  const columns = useMemo(
    () =>
      getGoodsReceivedColumns({
        onEdit: (item) => {
          setEditing(item);
          setFormOpen(true);
        },
        onDelete: async (item) => {
          if (confirm("Delete this goods received note?")) {
            await deleteGoodsReceived(item.id);
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
          New GRN
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="grnNumber"
        searchPlaceholder="Search by GRN #..."
      />
      <GoodsReceivedForm
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
