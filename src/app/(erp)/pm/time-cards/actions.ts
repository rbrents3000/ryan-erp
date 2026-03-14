"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { jobLabor } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import type { ActionResult } from "@/lib/types/action-result";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

type TimeCard = typeof jobLabor.$inferSelect;

const timeCardSchema = z.object({
  jobId: z.string().uuid("Valid Job ID is required"),
  employeeName: z.string().min(1, "Employee name is required"),
  workDate: z.string().min(1, "Work date is required"),
  hoursWorked: z.string().min(1, "Hours worked is required"),
  laborRate: z.string().optional(),
  operation: z.string().optional(),
  notes: z.string().optional(),
});

export async function listTimeCards(): Promise<TimeCard[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(jobLabor)
    .where(eq(jobLabor.tenantId, ctx.tenantId));
}

export async function createTimeCard(
  formData: unknown
): Promise<ActionResult<TimeCard>> {
  const ctx = await getTenantContext();
  const parsed = timeCardSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const laborCost =
    parseFloat(parsed.data.hoursWorked) *
    parseFloat(parsed.data.laborRate || "0");

  try {
    const [row] = await db
      .insert(jobLabor)
      .values({
        tenantId: ctx.tenantId,
        jobId: parsed.data.jobId,
        employeeName: parsed.data.employeeName,
        workDate: parsed.data.workDate,
        hoursWorked: parsed.data.hoursWorked,
        laborRate: parsed.data.laborRate || "0",
        laborCost: laborCost.toFixed(2),
        operation: parsed.data.operation || null,
        notes: parsed.data.notes || null,
        createdBy: ctx.userId,
      })
      .returning();

    revalidatePath("/pm/time-cards");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create time card";
    return { success: false, error: msg };
  }
}

export async function updateTimeCard(
  id: string,
  formData: unknown
): Promise<ActionResult<TimeCard>> {
  const ctx = await getTenantContext();
  const parsed = timeCardSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const laborCost =
    parseFloat(parsed.data.hoursWorked) *
    parseFloat(parsed.data.laborRate || "0");

  try {
    const [row] = await db
      .update(jobLabor)
      .set({
        jobId: parsed.data.jobId,
        employeeName: parsed.data.employeeName,
        workDate: parsed.data.workDate,
        hoursWorked: parsed.data.hoursWorked,
        laborRate: parsed.data.laborRate || "0",
        laborCost: laborCost.toFixed(2),
        operation: parsed.data.operation || null,
        notes: parsed.data.notes || null,
        updatedAt: new Date(),
      })
      .where(and(eq(jobLabor.id, id), eq(jobLabor.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/pm/time-cards");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update time card";
    return { success: false, error: msg };
  }
}

export async function deleteTimeCard(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .delete(jobLabor)
    .where(and(eq(jobLabor.id, id), eq(jobLabor.tenantId, ctx.tenantId)));

  revalidatePath("/pm/time-cards");
  return { success: true, data: undefined };
}
