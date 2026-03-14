"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { goodsReceived } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import type { ActionResult } from "@/lib/types/action-result";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

type GoodsReceivedNote = typeof goodsReceived.$inferSelect;

const goodsReceivedSchema = z.object({
  grnNumber: z.string().min(1, "GRN number is required"),
  poHeaderId: z.string().uuid("Valid PO ID is required"),
  vendorId: z.string().uuid("Valid Vendor ID is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  warehouseId: z.string().uuid("Valid Warehouse ID is required"),
  notes: z.string().optional(),
});

export async function listGoodsReceived(): Promise<GoodsReceivedNote[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(goodsReceived)
    .where(
      and(
        eq(goodsReceived.tenantId, ctx.tenantId),
        eq(goodsReceived.companyCode, ctx.defaultCompanyCode)
      )
    );
}

export async function createGoodsReceived(
  formData: unknown
): Promise<ActionResult<GoodsReceivedNote>> {
  const ctx = await getTenantContext();
  const parsed = goodsReceivedSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(goodsReceived)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        notes: parsed.data.notes || null,
        createdBy: ctx.userId,
      })
      .returning();

    revalidatePath("/pop/receiving");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create goods received note";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A GRN with this number already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateGoodsReceived(
  id: string,
  formData: unknown
): Promise<ActionResult<GoodsReceivedNote>> {
  const ctx = await getTenantContext();
  const parsed = goodsReceivedSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    // goodsReceived has no updatedAt column, only createdAt
    const [row] = await db
      .update(goodsReceived)
      .set({
        grnNumber: parsed.data.grnNumber,
        poHeaderId: parsed.data.poHeaderId,
        vendorId: parsed.data.vendorId,
        receivedDate: parsed.data.receivedDate,
        warehouseId: parsed.data.warehouseId,
        notes: parsed.data.notes || null,
      })
      .where(
        and(eq(goodsReceived.id, id), eq(goodsReceived.tenantId, ctx.tenantId))
      )
      .returning();

    revalidatePath("/pop/receiving");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update goods received note";
    return { success: false, error: msg };
  }
}

export async function deleteGoodsReceived(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(goodsReceived)
    .where(
      and(eq(goodsReceived.id, id), eq(goodsReceived.tenantId, ctx.tenantId))
    );

  revalidatePath("/pop/receiving");
  return { success: true, data: undefined };
}
