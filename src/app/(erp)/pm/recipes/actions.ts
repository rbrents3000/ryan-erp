"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { recipeSchema } from "@/lib/validations/production";
import type { ActionResult } from "@/lib/types/action-result";
import type { Recipe } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listRecipes(): Promise<Recipe[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(recipes)
    .where(
      and(
        eq(recipes.tenantId, ctx.tenantId),
        eq(recipes.companyCode, ctx.defaultCompanyCode),
        isNull(recipes.deletedAt)
      )
    );
}

export async function createRecipe(
  formData: unknown
): Promise<ActionResult<Recipe>> {
  const ctx = await getTenantContext();
  const parsed = recipeSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(recipes)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        description: parsed.data.description || null,
      })
      .returning();

    revalidatePath("/pm/recipes");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create recipe";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A recipe with this code already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateRecipe(
  id: string,
  formData: unknown
): Promise<ActionResult<Recipe>> {
  const ctx = await getTenantContext();
  const parsed = recipeSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(recipes)
      .set({
        ...parsed.data,
        description: parsed.data.description || null,
        updatedAt: new Date(),
      })
      .where(and(eq(recipes.id, id), eq(recipes.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/pm/recipes");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update recipe";
    return { success: false, error: msg };
  }
}

export async function deleteRecipe(id: string): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .update(recipes)
    .set({ deletedAt: new Date() })
    .where(and(eq(recipes.id, id), eq(recipes.tenantId, ctx.tenantId)));

  revalidatePath("/pm/recipes");
  return { success: true, data: undefined };
}
