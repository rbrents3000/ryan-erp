"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { productSchema } from "@/lib/validations/inventory";
import type { ActionResult } from "@/lib/types/action-result";
import type { Product } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function listProducts(): Promise<Product[]> {
  const ctx = await getTenantContext();
  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.tenantId, ctx.tenantId),
        eq(products.companyCode, ctx.defaultCompanyCode),
        isNull(products.deletedAt)
      )
    );
}

export async function createProduct(
  formData: unknown
): Promise<ActionResult<Product>> {
  const ctx = await getTenantContext();
  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .insert(products)
      .values({
        tenantId: ctx.tenantId,
        companyCode: ctx.defaultCompanyCode,
        ...parsed.data,
        description: parsed.data.description || null,
        productGroup: parsed.data.productGroup || null,
        standardCost: parsed.data.standardCost || "0",
        listPrice: parsed.data.listPrice || "0",
        weight: parsed.data.weight || null,
        weightUom: parsed.data.weightUom || null,
      })
      .returning();

    revalidatePath("/ic/products");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create product";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "A product with this part number already exists" };
    }
    return { success: false, error: msg };
  }
}

export async function updateProduct(
  id: string,
  formData: unknown
): Promise<ActionResult<Product>> {
  const ctx = await getTenantContext();
  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [row] = await db
      .update(products)
      .set({
        ...parsed.data,
        description: parsed.data.description || null,
        productGroup: parsed.data.productGroup || null,
        standardCost: parsed.data.standardCost || "0",
        listPrice: parsed.data.listPrice || "0",
        weight: parsed.data.weight || null,
        weightUom: parsed.data.weightUom || null,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, id), eq(products.tenantId, ctx.tenantId)))
      .returning();

    revalidatePath("/ic/products");
    return { success: true, data: row };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update product";
    return { success: false, error: msg };
  }
}

export async function deleteProduct(
  id: string
): Promise<ActionResult> {
  const ctx = await getTenantContext();

  await db
    .update(products)
    .set({ deletedAt: new Date() })
    .where(and(eq(products.id, id), eq(products.tenantId, ctx.tenantId)));

  revalidatePath("/ic/products");
  return { success: true, data: undefined };
}
