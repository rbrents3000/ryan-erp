"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { journalHeaders, journalLines } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { journalHeaderSchema } from "@/lib/validations/finance";
import type { ActionResult } from "@/lib/types/action-result";
import type { JournalHeader } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function listJournals(): Promise<JournalHeader[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(journalHeaders)
    .where(eq(journalHeaders.tenantId, ctx.tenantId));
}

export async function createJournal(formData: unknown): Promise<ActionResult<JournalHeader>> {
  const ctx = await getTenantContext();
  const parsed = journalHeaderSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(journalHeaders)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        journalDate: parsed.data.journalDate,
        periodId: parsed.data.periodId || null,
        description: parsed.data.description || null,
        source: parsed.data.source || null,
        createdBy: ctx.userId,
      })
      .returning();

    revalidatePath("/gl/journals");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create journal";
    return { success: false, error: msg };
  }
}

export async function updateJournal(id: string, formData: unknown): Promise<ActionResult<JournalHeader>> {
  const ctx = await getTenantContext();
  const parsed = journalHeaderSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(journalHeaders)
      .set({
        journalDate: parsed.data.journalDate,
        periodId: parsed.data.periodId || null,
        description: parsed.data.description || null,
        source: parsed.data.source || null,
        updatedAt: new Date(),
      })
      .where(and(eq(journalHeaders.id, id), eq(journalHeaders.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/gl/journals");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update journal";
    return { success: false, error: msg };
  }
}

export async function deleteJournal(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();
  // Delete lines first, then header
  await db
    .delete(journalLines)
    .where(eq(journalLines.journalHeaderId, id));
  await db
    .delete(journalHeaders)
    .where(and(eq(journalHeaders.id, id), eq(journalHeaders.tenantId, ctx.tenantId)));

  revalidatePath("/gl/journals");
  return { success: true, data: undefined };
}
