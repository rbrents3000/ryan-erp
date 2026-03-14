"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth/tenant";
import { sql } from "drizzle-orm";

export interface StockMovementRow {
  movementDate: string;
  partNumber: string;
  productName: string;
  warehouseCode: string;
  movementType: string;
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  notes: string | null;
}

export async function getStockMovements(
  startDate?: string,
  endDate?: string
): Promise<StockMovementRow[]> {
  const ctx = await getTenantContext();

  const dateFilters = sql.join(
    [
      startDate ? sql`AND sm.movement_date >= ${startDate}::timestamptz` : sql``,
      endDate ? sql`AND sm.movement_date <= (${endDate}::date + interval '1 day')` : sql``,
    ],
    sql` `
  );

  const rows = await db.execute(sql`
    SELECT
      sm.movement_date,
      p.part_number,
      p.name AS product_name,
      w.warehouse_code,
      sm.movement_type,
      sm.quantity::numeric AS quantity,
      sm.reference_type,
      sm.reference_id,
      sm.notes
    FROM inventory.stock_movements sm
    JOIN inventory.products p ON p.id = sm.product_id
      AND p.tenant_id = ${ctx.tenantId}
    JOIN inventory.warehouses w ON w.id = sm.warehouse_id
      AND w.tenant_id = ${ctx.tenantId}
    WHERE sm.tenant_id = ${ctx.tenantId}
      AND sm.company_code = ${ctx.defaultCompanyCode}
      ${dateFilters}
    ORDER BY sm.movement_date DESC
  `);

  return rows.map((r: Record<string, unknown>) => ({
    movementDate: new Date(r.movement_date as string).toLocaleDateString("en-US"),
    partNumber: r.part_number as string,
    productName: r.product_name as string,
    warehouseCode: r.warehouse_code as string,
    movementType: r.movement_type as string,
    quantity: parseFloat(String(r.quantity)) || 0,
    referenceType: (r.reference_type as string) || null,
    referenceId: (r.reference_id as string) || null,
    notes: (r.notes as string) || null,
  }));
}
