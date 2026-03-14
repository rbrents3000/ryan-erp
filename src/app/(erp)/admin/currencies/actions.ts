"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { currencies } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { currencySchema } from "@/lib/validations/system";
import type { ActionResult } from "@/lib/types/action-result";
import type { Currency } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listCurrencies(): Promise<Currency[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(currencies)
    .where(and(eq(currencies.tenantId, ctx.tenantId), isNull(currencies.deletedAt)));
}

export async function createCurrency(
  formData: unknown
): Promise<ActionResult<Currency>> {
  const ctx = await getTenantContext();
  const parsed = currencySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(currencies)
      .values({ tenantId: ctx.tenantId, ...parsed.data })
      .returning();

    revalidatePath("/admin/currencies");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create currency";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A currency with this code already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateCurrency(
  id: string,
  formData: unknown
): Promise<ActionResult<Currency>> {
  const ctx = await getTenantContext();
  const parsed = currencySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(currencies)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(currencies.id, id), eq(currencies.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/admin/currencies");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update currency";
    return { success: false, error: msg };
  }
}

export async function deleteCurrency(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();
  await db
    .update(currencies)
    .set({ deletedAt: new Date() })
    .where(and(eq(currencies.id, id), eq(currencies.tenantId, ctx.tenantId)));

  revalidatePath("/admin/currencies");
  return { success: true, data: undefined };
}
