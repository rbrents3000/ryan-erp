"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { assets } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { assetSchema } from "@/lib/validations/fixed-assets";
import type { ActionResult } from "@/lib/types/action-result";
import type { Asset } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listAssets(): Promise<Asset[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(assets)
    .where(
      and(
        eq(assets.tenantId, ctx.tenantId),
        eq(assets.companyCode, ctx.defaultCompanyCode),
        isNull(assets.deletedAt)
      )
    );
}

export async function createAsset(
  formData: unknown
): Promise<ActionResult<Asset>> {
  const ctx = await getTenantContext();
  const parsed = assetSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const { usefulLifeMonths, ...rest } = parsed.data;
    const [row] = await db
      .insert(assets)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...rest,
        usefulLifeMonths: parseInt(usefulLifeMonths, 10),
        glAccountId: parsed.data.glAccountId || null,
        depreciationAccountId: parsed.data.depreciationAccountId || null,
      })
      .returning();

    revalidatePath("/fa/assets");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create asset";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "An asset with this number already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateAsset(
  id: string,
  formData: unknown
): Promise<ActionResult<Asset>> {
  const ctx = await getTenantContext();
  const parsed = assetSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const { usefulLifeMonths, ...rest } = parsed.data;
    const [row] = await db
      .update(assets)
      .set({
        ...rest,
        usefulLifeMonths: parseInt(usefulLifeMonths, 10),
        glAccountId: parsed.data.glAccountId || null,
        depreciationAccountId: parsed.data.depreciationAccountId || null,
        updatedAt: new Date(),
      })
      .where(and(eq(assets.id, id), eq(assets.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/fa/assets");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update asset";
    return { success: false, error: msg };
  }
}

export async function deleteAsset(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();
  await db
    .update(assets)
    .set({ deletedAt: new Date() })
    .where(and(eq(assets.id, id), eq(assets.tenantId, ctx.tenantId)));

  revalidatePath("/fa/assets");
  return { success: true, data: undefined };
}
