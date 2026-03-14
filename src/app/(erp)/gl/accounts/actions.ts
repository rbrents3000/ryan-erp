"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { glAccounts } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { glAccountSchema } from "@/lib/validations/finance";
import type { ActionResult } from "@/lib/types/action-result";
import type { GlAccount } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listGlAccounts(): Promise<GlAccount[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(glAccounts)
    .where(and(eq(glAccounts.tenantId, ctx.tenantId), isNull(glAccounts.deletedAt)));
}

export async function createGlAccount(formData: unknown): Promise<ActionResult<GlAccount>> {
  const ctx = await getTenantContext();
  const parsed = glAccountSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(glAccounts)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        parentId: parsed.data.parentId || null,
      })
      .returning();

    revalidatePath("/gl/accounts");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create account";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "An account with this number already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateGlAccount(id: string, formData: unknown): Promise<ActionResult<GlAccount>> {
  const ctx = await getTenantContext();
  const parsed = glAccountSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(glAccounts)
      .set({
        ...parsed.data,
        parentId: parsed.data.parentId || null,
        updatedAt: new Date(),
      })
      .where(and(eq(glAccounts.id, id), eq(glAccounts.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/gl/accounts");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update account";
    return { success: false, error: msg };
  }
}

export async function deleteGlAccount(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();
  await db
    .update(glAccounts)
    .set({ deletedAt: new Date() })
    .where(and(eq(glAccounts.id, id), eq(glAccounts.tenantId, ctx.tenantId)));

  revalidatePath("/gl/accounts");
  return { success: true, data: undefined };
}
