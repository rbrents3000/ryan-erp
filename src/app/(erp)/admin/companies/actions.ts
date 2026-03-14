"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { companySchema } from "@/lib/validations/system";
import type { ActionResult } from "@/lib/types/action-result";
import type { Company } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listCompanies(): Promise<Company[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(companies)
    .where(and(eq(companies.tenantId, ctx.tenantId), isNull(companies.deletedAt)));
}

export async function createCompany(
  formData: unknown
): Promise<ActionResult<Company>> {
  const ctx = await getTenantContext();
  const parsed = companySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(companies)
      .values({
        tenantId: ctx.tenantId,
        ...parsed.data,
        email: parsed.data.email || null,
      })
      .returning();

    revalidatePath("/admin/companies");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create company";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A company with this code already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateCompany(
  id: string,
  formData: unknown
): Promise<ActionResult<Company>> {
  const ctx = await getTenantContext();
  const parsed = companySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(companies)
      .set({
        ...parsed.data,
        email: parsed.data.email || null,
        updatedAt: new Date(),
      })
      .where(and(eq(companies.id, id), eq(companies.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/admin/companies");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update company";
    return { success: false, error: msg };
  }
}

export async function deleteCompany(
  id: string
): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .update(companies)
    .set({ deletedAt: new Date() })
    .where(and(eq(companies.id, id), eq(companies.tenantId, ctx.tenantId)));

  revalidatePath("/admin/companies");
  return { success: true, data: undefined };
}
