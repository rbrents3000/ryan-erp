"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { poHeaders } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { poHeaderSchema } from "@/lib/validations/purchasing";
import type { ActionResult } from "@/lib/types/action-result";
import type { PoHeader } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function listPoOrders(): Promise<PoHeader[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(poHeaders)
    .where(
      and(
        eq(poHeaders.tenantId, ctx.tenantId),
        eq(poHeaders.companyCode, ctx.defaultCompanyCode)
      )
    );
}

export async function createPoOrder(
  formData: unknown
): Promise<ActionResult<PoHeader>> {
  const ctx = await getTenantContext();
  const parsed = poHeaderSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(poHeaders)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        expectedDate: parsed.data.expectedDate || null,
        notes: parsed.data.notes || null,
      })
      .returning();

    revalidatePath("/pop/orders");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create PO";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return {
        success: false,
        error: "A PO with this number already exists",
      };
    }
    return { success: false, error: msg };
  }
}

export async function updatePoOrder(
  id: string,
  formData: unknown
): Promise<ActionResult<PoHeader>> {
  const ctx = await getTenantContext();
  const parsed = poHeaderSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(poHeaders)
      .set({
        ...parsed.data,
        expectedDate: parsed.data.expectedDate || null,
        notes: parsed.data.notes || null,
        updatedAt: new Date(),
      })
      .where(and(eq(poHeaders.id, id), eq(poHeaders.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/pop/orders");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update PO";
    return { success: false, error: msg };
  }
}

export async function deletePoOrder(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(poHeaders)
    .where(and(eq(poHeaders.id, id), eq(poHeaders.tenantId, ctx.tenantId)));

  revalidatePath("/pop/orders");
  return { success: true, data: undefined };
}
