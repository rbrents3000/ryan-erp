"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { warehouses } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { warehouseSchema } from "@/lib/validations/inventory";
import type { ActionResult } from "@/lib/types/action-result";
import type { Warehouse } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listWarehouses(): Promise<Warehouse[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(warehouses)
    .where(
      and(
        eq(warehouses.tenantId, ctx.tenantId),
        eq(warehouses.companyCode, ctx.defaultCompanyCode),
        isNull(warehouses.deletedAt)
      )
    );
}

export async function createWarehouse(
  formData: unknown
): Promise<ActionResult<Warehouse>> {
  const ctx = await getTenantContext();
  const parsed = warehouseSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(warehouses)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        address: parsed.data.address || null,
      })
      .returning();

    revalidatePath("/ic/warehouses");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create warehouse";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A warehouse with this code already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateWarehouse(
  id: string,
  formData: unknown
): Promise<ActionResult<Warehouse>> {
  const ctx = await getTenantContext();
  const parsed = warehouseSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(warehouses)
      .set({
        ...parsed.data,
        address: parsed.data.address || null,
        updatedAt: new Date(),
      })
      .where(and(eq(warehouses.id, id), eq(warehouses.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/ic/warehouses");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update warehouse";
    return { success: false, error: msg };
  }
}

export async function deleteWarehouse(
  id: string
): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .update(warehouses)
    .set({ deletedAt: new Date() })
    .where(and(eq(warehouses.id, id), eq(warehouses.tenantId, ctx.tenantId)));

  revalidatePath("/ic/warehouses");
  return { success: true, data: undefined };
}
