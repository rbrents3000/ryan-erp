"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth/tenant";
import { sql } from "drizzle-orm";

export interface SalesInvoiceRow {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerNumber: string;
  customerName: string;
  totalAmount: number;
  balanceDue: number;
  status: string;
}

export async function listSalesInvoices(): Promise<SalesInvoiceRow[]> {
  const ctx = await getTenantContext();

  const rows = await db.execute(sql`
    SELECT
      i.id,
      i.invoice_number,
      i.invoice_date,
      i.due_date,
      i.total_amount::numeric AS total_amount,
      i.balance_due::numeric AS balance_due,
      i.status,
      c.customer_number,
      c.name AS customer_name
    FROM sales.ar_invoices i
    JOIN sales.customers c ON c.id = i.customer_id
    WHERE i.tenant_id = ${ctx.tenantId}
      AND i.company_code = ${ctx.defaultCompanyCode}
      AND i.order_id IS NOT NULL
    ORDER BY i.invoice_date DESC
  `);

  return rows.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    invoiceNumber: r.invoice_number as string,
    invoiceDate: r.invoice_date as string,
    dueDate: r.due_date as string,
    customerNumber: r.customer_number as string,
    customerName: r.customer_name as string,
    totalAmount: parseFloat(String(r.total_amount)) || 0,
    balanceDue: parseFloat(String(r.balance_due)) || 0,
    status: r.status as string,
  }));
}
