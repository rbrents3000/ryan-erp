"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { jobSchema } from "@/lib/validations/production";
import type { ActionResult } from "@/lib/types/action-result";
import type { Job } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function listJobs(): Promise<Job[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(jobs)
    .where(
      and(
        eq(jobs.tenantId, ctx.tenantId),
        eq(jobs.companyCode, ctx.defaultCompanyCode)
      )
    );
}

export async function createJob(
  formData: unknown
): Promise<ActionResult<Job>> {
  const ctx = await getTenantContext();
  const parsed = jobSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(jobs)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        plannedStart: parsed.data.plannedStart || null,
        plannedEnd: parsed.data.plannedEnd || null,
        warehouseId: parsed.data.warehouseId || null,
        notes: parsed.data.notes || null,
      })
      .returning();

    revalidatePath("/pm/jobs");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create job";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A job with this number already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateJob(
  id: string,
  formData: unknown
): Promise<ActionResult<Job>> {
  const ctx = await getTenantContext();
  const parsed = jobSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(jobs)
      .set({
        ...parsed.data,
        plannedStart: parsed.data.plannedStart || null,
        plannedEnd: parsed.data.plannedEnd || null,
        warehouseId: parsed.data.warehouseId || null,
        notes: parsed.data.notes || null,
        updatedAt: new Date(),
      })
      .where(and(eq(jobs.id, id), eq(jobs.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/pm/jobs");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update job";
    return { success: false, error: msg };
  }
}

export async function deleteJob(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.tenantId, ctx.tenantId)));

  revalidatePath("/pm/jobs");
  return { success: true, data: undefined };
}
