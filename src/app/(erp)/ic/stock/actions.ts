"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth/tenant";
import { sql } from "drizzle-orm";

export interface StockStatusRow {
  partNumber: string;
  productName: string;
  warehouseCode: string;
  warehouseName: string;
  qtyOnHand: number;
  qtyReserved: number;
  qtyOnOrder: number;
  available: number;
  reorderPoint: number | null;
  binLocation: string | null;
}

export async function getStockStatus(): Promise<StockStatusRow[]> {
  const ctx = await getTenantContext();

  const rows = await db.execute(sql`
    SELECT
      p.part_number,
      p.name AS product_name,
      w.warehouse_code,
      w.name AS warehouse_name,
      pw.qty_on_hand::numeric AS qty_on_hand,
      pw.qty_reserved::numeric AS qty_reserved,
      pw.qty_on_order::numeric AS qty_on_order,
      (pw.qty_on_hand::numeric - pw.qty_reserved::numeric) AS available,
      pw.reorder_point::numeric AS reorder_point,
      pw.bin_location
    FROM inventory.product_warehouse pw
    JOIN inventory.products p ON p.id = pw.product_id
      AND p.tenant_id = ${ctx.tenantId}
      AND p.deleted_at IS NULL
    JOIN inventory.warehouses w ON w.id = pw.warehouse_id
      AND w.tenant_id = ${ctx.tenantId}
    WHERE pw.tenant_id = ${ctx.tenantId}
      AND p.company_code = ${ctx.defaultCompanyCode}
    ORDER BY p.part_number, w.warehouse_code
  `);

  return rows.map((r: Record<string, unknown>) => ({
    partNumber: r.part_number as string,
    productName: r.product_name as string,
    warehouseCode: r.warehouse_code as string,
    warehouseName: r.warehouse_name as string,
    qtyOnHand: parseFloat(String(r.qty_on_hand)) || 0,
    qtyReserved: parseFloat(String(r.qty_reserved)) || 0,
    qtyOnOrder: parseFloat(String(r.qty_on_order)) || 0,
    available: parseFloat(String(r.available)) || 0,
    reorderPoint: r.reorder_point != null ? parseFloat(String(r.reorder_point)) : null,
    binLocation: (r.bin_location as string) || null,
  }));
}
