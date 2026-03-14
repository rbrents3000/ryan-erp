"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { cashReceipts } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { cashReceiptSchema } from "@/lib/validations/sales";
import type { ActionResult } from "@/lib/types/action-result";
import { eq, and } from "drizzle-orm";

type CashReceipt = typeof cashReceipts.$inferSelect;

export async function listReceipts(): Promise<CashReceipt[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(cashReceipts)
    .where(
      and(
        eq(cashReceipts.tenantId, ctx.tenantId),
        eq(cashReceipts.companyCode, ctx.defaultCompanyCode)
      )
    );
}

export async function createReceipt(
  formData: unknown
): Promise<ActionResult<CashReceipt>> {
  const ctx = await getTenantContext();
  const parsed = cashReceiptSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(cashReceipts)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
      })
      .returning();

    revalidatePath("/ar/receipts");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create receipt";
    return { success: false, error: msg };
  }
}

export async function updateReceipt(
  id: string,
  formData: unknown
): Promise<ActionResult<CashReceipt>> {
  const ctx = await getTenantContext();
  const parsed = cashReceiptSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(cashReceipts)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(
        and(eq(cashReceipts.id, id), eq(cashReceipts.tenantId, ctx.tenantId))
      )
      .returning();

    revalidatePath("/ar/receipts");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update receipt";
    return { success: false, error: msg };
  }
}

export async function deleteReceipt(
  id: string
): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(cashReceipts)
    .where(
      and(eq(cashReceipts.id, id), eq(cashReceipts.tenantId, ctx.tenantId))
    );

  revalidatePath("/ar/receipts");
  return { success: true, data: undefined };
}
