"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth/tenant";
import { sql } from "drizzle-orm";

export interface AgingRow {
  customerNumber: string;
  customerName: string;
  current: number;
  days31to60: number;
  days61to90: number;
  days90plus: number;
  total: number;
}

export async function getAgingReport(
  asOfDate?: string
): Promise<AgingRow[]> {
  const ctx = await getTenantContext();

  const refDate = asOfDate
    ? sql`${asOfDate}::date`
    : sql`CURRENT_DATE`;

  const rows = await db.execute(sql`
    SELECT
      c.customer_number,
      c.name AS customer_name,
      COALESCE(SUM(CASE WHEN (${refDate} - i.due_date) <= 30 THEN i.balance_due::numeric ELSE 0 END), 0) AS current_amount,
      COALESCE(SUM(CASE WHEN (${refDate} - i.due_date) BETWEEN 31 AND 60 THEN i.balance_due::numeric ELSE 0 END), 0) AS days_31_60,
      COALESCE(SUM(CASE WHEN (${refDate} - i.due_date) BETWEEN 61 AND 90 THEN i.balance_due::numeric ELSE 0 END), 0) AS days_61_90,
      COALESCE(SUM(CASE WHEN (${refDate} - i.due_date) > 90 THEN i.balance_due::numeric ELSE 0 END), 0) AS days_90_plus,
      COALESCE(SUM(i.balance_due::numeric), 0) AS total
    FROM sales.ar_invoices i
    JOIN sales.customers c ON c.id = i.customer_id
      AND c.tenant_id = ${ctx.tenantId}
    WHERE i.tenant_id = ${ctx.tenantId}
      AND i.company_code = ${ctx.defaultCompanyCode}
      AND i.balance_due::numeric > 0
    GROUP BY c.customer_number, c.name
    ORDER BY c.customer_number
  `);

  return rows.map((r: Record<string, unknown>) => ({
    customerNumber: r.customer_number as string,
    customerName: r.customer_name as string,
    current: parseFloat(String(r.current_amount)) || 0,
    days31to60: parseFloat(String(r.days_31_60)) || 0,
    days61to90: parseFloat(String(r.days_61_90)) || 0,
    days90plus: parseFloat(String(r.days_90_plus)) || 0,
    total: parseFloat(String(r.total)) || 0,
  }));
}
