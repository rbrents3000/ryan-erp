"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { despatchNotes } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import type { ActionResult } from "@/lib/types/action-result";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

type DespatchNote = typeof despatchNotes.$inferSelect;

const despatchSchema = z.object({
  despatchNumber: z.string().min(1, "Despatch number is required"),
  orderId: z.string().uuid("Valid Order ID is required"),
  customerId: z.string().uuid("Valid Customer ID is required"),
  despatchDate: z.string().min(1, "Despatch date is required"),
  warehouseId: z.string().uuid("Valid Warehouse ID is required"),
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

export async function listDespatchNotes(): Promise<DespatchNote[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(despatchNotes)
    .where(
      and(
        eq(despatchNotes.tenantId, ctx.tenantId),
        eq(despatchNotes.companyCode, ctx.defaultCompanyCode)
      )
    );
}

export async function createDespatchNote(
  formData: unknown
): Promise<ActionResult<DespatchNote>> {
  const ctx = await getTenantContext();
  const parsed = despatchSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(despatchNotes)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        despatchNumber: parsed.data.despatchNumber,
        orderId: parsed.data.orderId,
        customerId: parsed.data.customerId,
        despatchDate: parsed.data.despatchDate,
        warehouseId: parsed.data.warehouseId,
        carrier: parsed.data.carrier || null,
        trackingNumber: parsed.data.trackingNumber || null,
        notes: parsed.data.notes || null,
        createdBy: ctx.userId,
      })
      .returning();

    revalidatePath("/sop/despatch");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create despatch note";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A despatch note with this number already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateDespatchNote(
  id: string,
  formData: unknown
): Promise<ActionResult<DespatchNote>> {
  const ctx = await getTenantContext();
  const parsed = despatchSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    // despatchNotes has NO updatedAt column
    const [row] = await db
      .update(despatchNotes)
      .set({
        despatchNumber: parsed.data.despatchNumber,
        orderId: parsed.data.orderId,
        customerId: parsed.data.customerId,
        despatchDate: parsed.data.despatchDate,
        warehouseId: parsed.data.warehouseId,
        carrier: parsed.data.carrier || null,
        trackingNumber: parsed.data.trackingNumber || null,
        notes: parsed.data.notes || null,
      })
      .where(
        and(
          eq(despatchNotes.id, id),
          eq(despatchNotes.tenantId, ctx.tenantId)
        )
      )
      .returning();

    revalidatePath("/sop/despatch");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update despatch note";
    return { success: false, error: msg };
  }
}

export async function deleteDespatchNote(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(despatchNotes)
    .where(
      and(
        eq(despatchNotes.id, id),
        eq(despatchNotes.tenantId, ctx.tenantId)
      )
    );

  revalidatePath("/sop/despatch");
  return { success: true, data: undefined };
}
