"use client";

import { useState, useMemo } from "react";
import type { Order } from "@/lib/db/schema";
import { DataTable } from "@/components/erp/data-table";
import { getOrderColumns } from "./columns";
import { OrderForm } from "./order-form";
import { deleteOrder } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderListProps {
  data: Order[];
}

export function OrderList({ data }: OrderListProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);

  const columns = useMemo(
    () =>
      getOrderColumns({
        onEdit: (order) => {
          setEditing(order);
          setFormOpen(true);
        },
        onDelete: async (order) => {
          if (confirm(`Delete order "${order.orderNumber}"?`)) {
            await deleteOrder(order.id);
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
          New Order
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="orderNumber"
        searchPlaceholder="Search orders..."
      />
      <OrderForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        order={editing}
      />
    </>
  );
}
