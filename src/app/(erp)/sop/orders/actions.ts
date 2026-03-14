"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { orderSchema } from "@/lib/validations/sales";
import type { ActionResult } from "@/lib/types/action-result";
import type { Order } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function listOrders(): Promise<Order[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.tenantId, ctx.tenantId),
        eq(orders.companyCode, ctx.defaultCompanyCode)
      )
    );
}

export async function createOrder(
  formData: unknown
): Promise<ActionResult<Order>> {
  const ctx = await getTenantContext();
  const parsed = orderSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(orders)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        requiredDate: parsed.data.requiredDate || null,
        shipToName: parsed.data.shipToName || null,
        shipToAddress: parsed.data.shipToAddress || null,
        shipToCity: parsed.data.shipToCity || null,
        shipToState: parsed.data.shipToState || null,
        shipToPostalCode: parsed.data.shipToPostalCode || null,
        shipToCountry: parsed.data.shipToCountry || null,
        notes: parsed.data.notes || null,
      })
      .returning();

    revalidatePath("/sop/orders");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create order";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return {
        success: false,
        error: "An order with this number already exists",
      };
    }
    return { success: false, error: msg };
  }
}

export async function updateOrder(
  id: string,
  formData: unknown
): Promise<ActionResult<Order>> {
  const ctx = await getTenantContext();
  const parsed = orderSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(orders)
      .set({
        ...parsed.data,
        requiredDate: parsed.data.requiredDate || null,
        shipToName: parsed.data.shipToName || null,
        shipToAddress: parsed.data.shipToAddress || null,
        shipToCity: parsed.data.shipToCity || null,
        shipToState: parsed.data.shipToState || null,
        shipToPostalCode: parsed.data.shipToPostalCode || null,
        shipToCountry: parsed.data.shipToCountry || null,
        notes: parsed.data.notes || null,
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, id), eq(orders.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/sop/orders");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update order";
    return { success: false, error: msg };
  }
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(orders)
    .where(and(eq(orders.id, id), eq(orders.tenantId, ctx.tenantId)));

  revalidatePath("/sop/orders");
  return { success: true, data: undefined };
}
