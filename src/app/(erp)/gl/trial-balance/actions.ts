"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth/tenant";
import { sql } from "drizzle-orm";

export interface TrialBalanceRow {
  accountId: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  normalBalance: string;
  totalDebit: number;
  totalCredit: number;
  netBalance: number;
}

export async function getTrialBalance(
  asOfDate?: string
): Promise<TrialBalanceRow[]> {
  const ctx = await getTenantContext();

  const dateFilter = asOfDate
    ? sql`AND h.journal_date <= ${asOfDate}`
    : sql``;

  const rows = await db.execute(sql`
    SELECT
      a.id AS account_id,
      a.account_number,
      a.name AS account_name,
      a.account_type,
      a.normal_balance,
      COALESCE(SUM(l.debit), 0)::numeric AS total_debit,
      COALESCE(SUM(l.credit), 0)::numeric AS total_credit,
      (COALESCE(SUM(l.debit), 0) - COALESCE(SUM(l.credit), 0))::numeric AS net_balance
    FROM finance.gl_accounts a
    LEFT JOIN finance.journal_lines l ON l.account_id = a.id
      AND l.tenant_id = ${ctx.tenantId}
    LEFT JOIN finance.journal_headers h ON h.id = l.journal_header_id
      AND h.status = 'posted'
      AND h.company_code = ${ctx.defaultCompanyCode}
      AND h.tenant_id = ${ctx.tenantId}
      ${dateFilter}
    WHERE a.tenant_id = ${ctx.tenantId}
      AND a.company_code = ${ctx.defaultCompanyCode}
      AND a.is_posting = true
      AND a.deleted_at IS NULL
    GROUP BY a.id, a.account_number, a.name, a.account_type, a.normal_balance
    ORDER BY a.account_number
  `);

  return rows.map((r: Record<string, unknown>) => ({
    accountId: r.account_id as string,
    accountNumber: r.account_number as string,
    accountName: r.account_name as string,
    accountType: r.account_type as string,
    normalBalance: r.normal_balance as string,
    totalDebit: parseFloat(String(r.total_debit)) || 0,
    totalCredit: parseFloat(String(r.total_credit)) || 0,
    netBalance: parseFloat(String(r.net_balance)) || 0,
  }));
}
