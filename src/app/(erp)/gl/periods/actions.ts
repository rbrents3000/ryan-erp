"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { periods } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { periodSchema } from "@/lib/validations/system";
import type { ActionResult } from "@/lib/types/action-result";
import type { Period } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function listPeriods(companyCode: string): Promise<Period[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(periods)
    .where(
      and(eq(periods.tenantId, ctx.tenantId), eq(periods.companyCode, companyCode))
    )
    .orderBy(periods.fiscalYear, periods.periodNum);
}

export async function createPeriod(
  formData: unknown
): Promise<ActionResult<Period>> {
  const ctx = await getTenantContext();
  const parsed = periodSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(periods)
      .values({ tenantId: ctx.tenantId, ...parsed.data })
      .returning();

    revalidatePath("/gl/periods");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create period";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "This period already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updatePeriod(
  id: string,
  formData: unknown
): Promise<ActionResult<Period>> {
  const ctx = await getTenantContext();
  const parsed = periodSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(periods)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(periods.id, id), eq(periods.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/gl/periods");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update period";
    return { success: false, error: msg };
  }
}

export async function deletePeriod(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();
  await db
    .delete(periods)
    .where(and(eq(periods.id, id), eq(periods.tenantId, ctx.tenantId)));

  revalidatePath("/gl/periods");
  return { success: true, data: undefined };
}
