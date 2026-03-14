"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth/tenant";
import { sql } from "drizzle-orm";

export interface CapacityRow {
  weekStart: string;
  jobCount: number;
  workerCount: number;
  totalHours: number;
  totalCost: number;
}

export async function getCapacityData(): Promise<CapacityRow[]> {
  const ctx = await getTenantContext();

  const rows = await db.execute(sql`
    SELECT
      date_trunc('week', jl.work_date::timestamp)::date AS week_start,
      COUNT(DISTINCT jl.job_id)::int AS job_count,
      COUNT(DISTINCT jl.employee_name)::int AS worker_count,
      SUM(jl.hours_worked)::numeric AS total_hours,
      SUM(jl.labor_cost)::numeric AS total_cost
    FROM production.job_labor jl
    JOIN production.jobs j ON j.id = jl.job_id
    WHERE jl.tenant_id = ${ctx.tenantId}
      AND j.company_code = ${ctx.defaultCompanyCode}
    GROUP BY date_trunc('week', jl.work_date::timestamp)
    ORDER BY week_start DESC
  `);

  return rows.map((r: Record<string, unknown>) => ({
    weekStart: r.week_start as string,
    jobCount: parseInt(String(r.job_count)) || 0,
    workerCount: parseInt(String(r.worker_count)) || 0,
    totalHours: parseFloat(String(r.total_hours)) || 0,
    totalCost: parseFloat(String(r.total_cost)) || 0,
  }));
}
