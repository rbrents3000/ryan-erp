"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { paymentSchema } from "@/lib/validations/purchasing";
import type { ActionResult } from "@/lib/types/action-result";
import { eq, and } from "drizzle-orm";

type Payment = typeof payments.$inferSelect;

export async function listPayments(): Promise<Payment[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.tenantId, ctx.tenantId),
        eq(payments.companyCode, ctx.defaultCompanyCode)
      )
    );
}

export async function createPayment(
  formData: unknown
): Promise<ActionResult<Payment>> {
  const ctx = await getTenantContext();
  const parsed = paymentSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(payments)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        glAccountId: parsed.data.glAccountId || null,
      })
      .returning();

    revalidatePath("/ap/payments");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create payment";
    return { success: false, error: msg };
  }
}

export async function updatePayment(
  id: string,
  formData: unknown
): Promise<ActionResult<Payment>> {
  const ctx = await getTenantContext();
  const parsed = paymentSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(payments)
      .set({
        ...parsed.data,
        glAccountId: parsed.data.glAccountId || null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(payments.id, id), eq(payments.tenantId, ctx.tenantId))
      )
      .returning();

    revalidatePath("/ap/payments");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update payment";
    return { success: false, error: msg };
  }
}

export async function deletePayment(
  id: string
): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(payments)
    .where(
      and(eq(payments.id, id), eq(payments.tenantId, ctx.tenantId))
    );

  revalidatePath("/ap/payments");
  return { success: true, data: undefined };
}
