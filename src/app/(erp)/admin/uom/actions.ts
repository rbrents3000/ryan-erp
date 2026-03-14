"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { unitsOfMeasure } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { uomSchema } from "@/lib/validations/system";
import type { ActionResult } from "@/lib/types/action-result";
import type { UnitOfMeasure } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listUom(): Promise<UnitOfMeasure[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(unitsOfMeasure)
    .where(and(eq(unitsOfMeasure.tenantId, ctx.tenantId), isNull(unitsOfMeasure.deletedAt)));
}

export async function createUom(
  formData: unknown
): Promise<ActionResult<UnitOfMeasure>> {
  const ctx = await getTenantContext();
  const parsed = uomSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(unitsOfMeasure)
      .values({ tenantId: ctx.tenantId, ...parsed.data })
      .returning();

    revalidatePath("/admin/uom");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create UOM";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A UOM with this code already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateUom(
  id: string,
  formData: unknown
): Promise<ActionResult<UnitOfMeasure>> {
  const ctx = await getTenantContext();
  const parsed = uomSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(unitsOfMeasure)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(unitsOfMeasure.id, id), eq(unitsOfMeasure.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/admin/uom");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update UOM";
    return { success: false, error: msg };
  }
}

export async function deleteUom(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();
  await db
    .update(unitsOfMeasure)
    .set({ deletedAt: new Date() })
    .where(and(eq(unitsOfMeasure.id, id), eq(unitsOfMeasure.tenantId, ctx.tenantId)));

  revalidatePath("/admin/uom");
  return { success: true, data: undefined };
}
