"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth/tenant";
import { sql } from "drizzle-orm";

export interface ShippingRow {
  id: string;
  despatchNumber: string;
  despatchDate: string;
  customerNumber: string;
  customerName: string;
  carrier: string | null;
  trackingNumber: string | null;
}

export async function listShipments(): Promise<ShippingRow[]> {
  const ctx = await getTenantContext();

  const rows = await db.execute(sql`
    SELECT
      d.id,
      d.despatch_number,
      d.despatch_date,
      c.customer_number,
      c.name AS customer_name,
      d.carrier,
      d.tracking_number
    FROM sales.despatch_notes d
    JOIN sales.customers c ON c.id = d.customer_id
    WHERE d.tenant_id = ${ctx.tenantId}
      AND d.company_code = ${ctx.defaultCompanyCode}
    ORDER BY d.despatch_date DESC
  `);

  return rows.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    despatchNumber: r.despatch_number as string,
    despatchDate: r.despatch_date as string,
    customerNumber: r.customer_number as string,
    customerName: r.customer_name as string,
    carrier: (r.carrier as string) || null,
    trackingNumber: (r.tracking_number as string) || null,
  }));
}
