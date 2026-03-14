"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { vendors } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { vendorSchema } from "@/lib/validations/purchasing";
import type { ActionResult } from "@/lib/types/action-result";
import type { Vendor } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listVendors(): Promise<Vendor[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(vendors)
    .where(and(eq(vendors.tenantId, ctx.tenantId), isNull(vendors.deletedAt)));
}

export async function createVendor(
  formData: unknown
): Promise<ActionResult<Vendor>> {
  const ctx = await getTenantContext();
  const parsed = vendorSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(vendors)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        email: parsed.data.email || null,
      })
      .returning();

    revalidatePath("/ap/vendors");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create vendor";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A vendor with this number already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateVendor(
  id: string,
  formData: unknown
): Promise<ActionResult<Vendor>> {
  const ctx = await getTenantContext();
  const parsed = vendorSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(vendors)
      .set({
        ...parsed.data,
        email: parsed.data.email || null,
        updatedAt: new Date(),
      })
      .where(and(eq(vendors.id, id), eq(vendors.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/ap/vendors");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update vendor";
    return { success: false, error: msg };
  }
}

export async function deleteVendor(
  id: string
): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .update(vendors)
    .set({ deletedAt: new Date() })
    .where(and(eq(vendors.id, id), eq(vendors.tenantId, ctx.tenantId)));

  revalidatePath("/ap/vendors");
  return { success: true, data: undefined };
}
