"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { arInvoices } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { arInvoiceSchema } from "@/lib/validations/sales";
import type { ActionResult } from "@/lib/types/action-result";
import type { ArInvoice } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function listArInvoices(): Promise<ArInvoice[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(arInvoices)
    .where(
      and(
        eq(arInvoices.tenantId, ctx.tenantId),
        eq(arInvoices.companyCode, ctx.defaultCompanyCode)
      )
    );
}

export async function createArInvoice(
  formData: unknown
): Promise<ActionResult<ArInvoice>> {
  const ctx = await getTenantContext();
  const parsed = arInvoiceSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(arInvoices)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        glAccountId: parsed.data.glAccountId || null,
      })
      .returning();

    revalidatePath("/ar/invoices");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create invoice";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return {
        success: false,
        error: "An invoice with this number already exists",
      };
    }
    return { success: false, error: msg };
  }
}

export async function updateArInvoice(
  id: string,
  formData: unknown
): Promise<ActionResult<ArInvoice>> {
  const ctx = await getTenantContext();
  const parsed = arInvoiceSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(arInvoices)
      .set({
        ...parsed.data,
        glAccountId: parsed.data.glAccountId || null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(arInvoices.id, id), eq(arInvoices.tenantId, ctx.tenantId))
      )
      .returning();

    revalidatePath("/ar/invoices");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update invoice";
    return { success: false, error: msg };
  }
}

export async function deleteArInvoice(
  id: string
): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(arInvoices)
    .where(
      and(eq(arInvoices.id, id), eq(arInvoices.tenantId, ctx.tenantId))
    );

  revalidatePath("/ar/invoices");
  return { success: true, data: undefined };
}
