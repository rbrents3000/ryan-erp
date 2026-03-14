"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { parameters } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { parameterSchema } from "@/lib/validations/system";
import type { ActionResult } from "@/lib/types/action-result";
import type { Period } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type Parameter = typeof parameters.$inferSelect;

export async function listParameters(companyCode?: string): Promise<Parameter[]> {
  const ctx = await getTenantContext();
  const conditions = [eq(parameters.tenantId, ctx.tenantId)];
  if (companyCode) {
    conditions.push(eq(parameters.companyCode, companyCode));
  }
  return db.select().from(parameters).where(and(...conditions));
}

export async function createParameter(
  formData: unknown
): Promise<ActionResult<Parameter>> {
  const ctx = await getTenantContext();
  const parsed = parameterSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(parameters)
      .values({
        tenantId: ctx.tenantId,
        companyCode: parsed.data.companyCode || null,
        key: parsed.data.key,
        value: parsed.data.value || null,
      })
      .returning();

    revalidatePath("/admin/parameters");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create parameter";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A parameter with this key already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateParameter(
  id: string,
  formData: unknown
): Promise<ActionResult<Parameter>> {
  const ctx = await getTenantContext();
  const parsed = parameterSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(parameters)
      .set({
        companyCode: parsed.data.companyCode || null,
        key: parsed.data.key,
        value: parsed.data.value || null,
        updatedAt: new Date(),
      })
      .where(and(eq(parameters.id, id), eq(parameters.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/admin/parameters");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update parameter";
    return { success: false, error: msg };
  }
}

export async function deleteParameter(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();
  await db
    .delete(parameters)
    .where(and(eq(parameters.id, id), eq(parameters.tenantId, ctx.tenantId)));

  revalidatePath("/admin/parameters");
  return { success: true, data: undefined };
}
