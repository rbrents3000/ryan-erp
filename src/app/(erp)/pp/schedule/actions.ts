"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth/tenant";
import { sql } from "drizzle-orm";

export interface ScheduleRow {
  id: string;
  jobNumber: string;
  recipeCode: string;
  recipeName: string;
  plannedQty: number;
  actualQty: number;
  plannedStart: string | null;
  plannedEnd: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  status: string;
}

export async function getProductionSchedule(): Promise<ScheduleRow[]> {
  const ctx = await getTenantContext();

  const rows = await db.execute(sql`
    SELECT
      j.id,
      j.job_number,
      j.planned_quantity::numeric AS planned_quantity,
      j.actual_quantity::numeric AS actual_quantity,
      j.planned_start,
      j.planned_end,
      j.actual_start,
      j.actual_end,
      j.status,
      r.recipe_code,
      r.name AS recipe_name
    FROM production.jobs j
    JOIN production.recipes r ON r.id = j.recipe_id
    WHERE j.tenant_id = ${ctx.tenantId}
      AND j.company_code = ${ctx.defaultCompanyCode}
      AND j.status IN ('planned', 'released', 'in_progress')
    ORDER BY j.planned_start ASC NULLS LAST, j.job_number
  `);

  return rows.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    jobNumber: r.job_number as string,
    recipeCode: r.recipe_code as string,
    recipeName: r.recipe_name as string,
    plannedQty: parseFloat(String(r.planned_quantity)) || 0,
    actualQty: parseFloat(String(r.actual_quantity)) || 0,
    plannedStart: (r.planned_start as string) || null,
    plannedEnd: (r.planned_end as string) || null,
    actualStart: (r.actual_start as string) || null,
    actualEnd: (r.actual_end as string) || null,
    status: r.status as string,
  }));
}
