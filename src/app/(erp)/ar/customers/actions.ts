"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { customerSchema } from "@/lib/validations/sales";
import type { ActionResult } from "@/lib/types/action-result";
import type { Customer } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listCustomers(): Promise<Customer[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(customers)
    .where(and(eq(customers.tenantId, ctx.tenantId), isNull(customers.deletedAt)));
}

export async function createCustomer(
  formData: unknown
): Promise<ActionResult<Customer>> {
  const ctx = await getTenantContext();
  const parsed = customerSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(customers)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        email: parsed.data.email || null,
      })
      .returning();

    revalidatePath("/ar/customers");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create customer";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A customer with this number already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateCustomer(
  id: string,
  formData: unknown
): Promise<ActionResult<Customer>> {
  const ctx = await getTenantContext();
  const parsed = customerSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(customers)
      .set({
        ...parsed.data,
        email: parsed.data.email || null,
        updatedAt: new Date(),
      })
      .where(and(eq(customers.id, id), eq(customers.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/ar/customers");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update customer";
    return { success: false, error: msg };
  }
}

export async function deleteCustomer(
  id: string
): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .update(customers)
    .set({ deletedAt: new Date() })
    .where(and(eq(customers.id, id), eq(customers.tenantId, ctx.tenantId)));

  revalidatePath("/ar/customers");
  return { success: true, data: undefined };
}
