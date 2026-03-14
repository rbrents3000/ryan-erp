"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { apInvoices } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { apInvoiceSchema } from "@/lib/validations/purchasing";
import type { ActionResult } from "@/lib/types/action-result";
import type { ApInvoice } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function listApInvoices(): Promise<ApInvoice[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(apInvoices)
    .where(
      and(
        eq(apInvoices.tenantId, ctx.tenantId),
        eq(apInvoices.companyCode, ctx.defaultCompanyCode)
      )
    );
}

export async function createApInvoice(
  formData: unknown
): Promise<ActionResult<ApInvoice>> {
  const ctx = await getTenantContext();
  const parsed = apInvoiceSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(apInvoices)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        glAccountId: parsed.data.glAccountId || null,
      })
      .returning();

    revalidatePath("/ap/invoices");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create invoice";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return {
        success: false,
        error: "An invoice with this number already exists for this vendor",
      };
    }
    return { success: false, error: msg };
  }
}

export async function updateApInvoice(
  id: string,
  formData: unknown
): Promise<ActionResult<ApInvoice>> {
  const ctx = await getTenantContext();
  const parsed = apInvoiceSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(apInvoices)
      .set({
        ...parsed.data,
        glAccountId: parsed.data.glAccountId || null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(apInvoices.id, id), eq(apInvoices.tenantId, ctx.tenantId))
      )
      .returning();

    revalidatePath("/ap/invoices");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update invoice";
    return { success: false, error: msg };
  }
}

export async function deleteApInvoice(
  id: string
): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(apInvoices)
    .where(
      and(eq(apInvoices.id, id), eq(apInvoices.tenantId, ctx.tenantId))
    );

  revalidatePath("/ap/invoices");
  return { success: true, data: undefined };
}
