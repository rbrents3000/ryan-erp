"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import type { ActionResult } from "@/lib/types/action-result";
import type { UserProfile } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const userProfileSchema = z.object({
  displayName: z.string().optional(),
  defaultCompanyCode: z.string().min(1, "Default company code is required"),
});

export async function listUserProfiles(): Promise<UserProfile[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.tenantId, ctx.tenantId));
}

export async function updateUserProfile(
  id: string,
  formData: unknown
): Promise<ActionResult<UserProfile>> {
  const ctx = await getTenantContext();
  const parsed = userProfileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(userProfiles)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(
        and(eq(userProfiles.id, id), eq(userProfiles.tenantId, ctx.tenantId))
      )
      .returning();

    revalidatePath("/admin/users");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update user profile";
    return { success: false, error: msg };
  }
}
