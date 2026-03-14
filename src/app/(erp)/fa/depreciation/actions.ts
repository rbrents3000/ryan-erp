"use server";

import { db } from "@/lib/db";
import { depreciationEntries, assets } from "@/lib/db/schema";
import { getTenantContext } from "@/lib/auth/tenant";
import { eq, desc } from "drizzle-orm";

export type DepreciationEntryWithAsset = {
  id: string;
  tenantId: string;
  assetId: string;
  periodId: string | null;
  depreciationDate: string;
  amount: string;
  accumulatedTotal: string;
  journalHeaderId: string | null;
  createdAt: Date;
  assetNumber: string;
  assetName: string;
};

export async function listDepreciationEntries(): Promise<DepreciationEntryWithAsset[]> {
  const ctx = await getTenantContext();

  const rows = await db
    .select({
      id: depreciationEntries.id,
      tenantId: depreciationEntries.tenantId,
      assetId: depreciationEntries.assetId,
      periodId: depreciationEntries.periodId,
      depreciationDate: depreciationEntries.depreciationDate,
      amount: depreciationEntries.amount,
      accumulatedTotal: depreciationEntries.accumulatedTotal,
      journalHeaderId: depreciationEntries.journalHeaderId,
      createdAt: depreciationEntries.createdAt,
      assetNumber: assets.assetNumber,
      assetName: assets.name,
    })
    .from(depreciationEntries)
    .innerJoin(assets, eq(assets.id, depreciationEntries.assetId))
    .where(eq(depreciationEntries.tenantId, ctx.tenantId))
    .orderBy(desc(depreciationEntries.depreciationDate));

  return rows;
}
