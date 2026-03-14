"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth/tenant";
import { sql } from "drizzle-orm";

export interface MrpRow {
  id: string;
  partNumber: string;
  productName: string;
  qtyOnHand: number;
  qtyDemand: number;
  qtySupply: number;
  netRequirement: number;
}

export async function getMrpData(): Promise<MrpRow[]> {
  const ctx = await getTenantContext();

  const rows = await db.execute(sql`
    SELECT
      p.id,
      p.part_number,
      p.name,
      COALESCE((
        SELECT SUM(pw.qty_on_hand)
        FROM inventory.product_warehouse pw
        WHERE pw.product_id = p.id
      ), 0)::numeric AS qty_on_hand,
      COALESCE((
        SELECT SUM(ol.quantity - ol.qty_shipped)
        FROM sales.order_lines ol
        JOIN sales.orders o ON o.id = ol.order_id
        WHERE ol.product_id = p.id
          AND o.status IN ('draft', 'approved')
          AND o.tenant_id = ${ctx.tenantId}
      ), 0)::numeric AS qty_demand,
      COALESCE((
        SELECT SUM(pl.quantity - pl.qty_received)
        FROM purchasing.po_lines pl
        JOIN purchasing.po_headers ph ON ph.id = pl.po_header_id
        WHERE pl.product_id = p.id
          AND ph.status IN ('draft', 'approved', 'sent')
          AND ph.tenant_id = ${ctx.tenantId}
      ), 0)::numeric AS qty_supply
    FROM inventory.products p
    WHERE p.tenant_id = ${ctx.tenantId}
      AND p.company_code = ${ctx.defaultCompanyCode}
      AND p.deleted_at IS NULL
    ORDER BY p.part_number
  `);

  return rows.map((r: Record<string, unknown>) => {
    const qtyOnHand = parseFloat(String(r.qty_on_hand)) || 0;
    const qtyDemand = parseFloat(String(r.qty_demand)) || 0;
    const qtySupply = parseFloat(String(r.qty_supply)) || 0;
    const netRequirement = qtyDemand - qtyOnHand - qtySupply;
    return {
      id: r.id as string,
      partNumber: r.part_number as string,
      productName: r.name as string,
      qtyOnHand,
      qtyDemand,
      qtySupply,
      netRequirement,
    };
  });
}
