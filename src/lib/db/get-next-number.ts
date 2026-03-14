"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

/**
 * Get the next auto-generated document number for a given type.
 * Uses a Postgres function with row-level locking to prevent duplicates.
 *
 * Document types: ar_invoice, ap_invoice, sales_order, purchase_order,
 *                 despatch_note, grn, asset
 */
export async function getNextNumber(
  tenantId: string,
  companyCode: string,
  documentType: string
): Promise<string> {
  const result = await db.execute(
    sql`SELECT system.get_next_number(${tenantId}::uuid, ${companyCode}, ${documentType}) AS doc_number`
  );
  return (result[0] as { doc_number: string }).doc_number;
}
