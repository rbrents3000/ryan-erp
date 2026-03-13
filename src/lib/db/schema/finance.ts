import {
  pgSchema,
  uuid,
  text,
  integer,
  timestamp,
  date,
  numeric,
  boolean,
  serial,
  check,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants, periods } from "./system";

export const financeSchema = pgSchema("finance");

// Chart of Accounts
export const glAccounts = financeSchema.table(
  "gl_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    accountNumber: text("account_number").notNull(),
    name: text("name").notNull(),
    accountType: text("account_type").notNull(),
    isHeader: boolean("is_header").notNull().default(false),
    isPosting: boolean("is_posting").notNull().default(true),
    parentId: uuid("parent_id"),
    normalBalance: text("normal_balance").notNull().default("debit"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.accountNumber)]
);

// Account Structure
export const glStructure = financeSchema.table(
  "gl_structure",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    segmentName: text("segment_name").notNull(),
    segmentOrder: integer("segment_order").notNull(),
    segmentLength: integer("segment_length").notNull(),
    separator: text("separator").notNull().default("-"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.segmentOrder)]
);

// Journal Headers
export const journalHeaders = financeSchema.table("journal_headers", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  companyCode: text("company_code").notNull(),
  journalNumber: serial("journal_number"),
  journalDate: date("journal_date").notNull().default(sql`CURRENT_DATE`),
  periodId: uuid("period_id").references(() => periods.id),
  description: text("description"),
  source: text("source"),
  status: text("status").notNull().default("draft"),
  postedAt: timestamp("posted_at", { withTimezone: true }),
  postedBy: uuid("posted_by"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Journal Lines
export const journalLines = financeSchema.table(
  "journal_lines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    journalHeaderId: uuid("journal_header_id").notNull().references(() => journalHeaders.id, { onDelete: "cascade" }),
    lineNumber: integer("line_number").notNull(),
    accountId: uuid("account_id").notNull().references(() => glAccounts.id),
    description: text("description"),
    debit: numeric("debit", { precision: 20, scale: 2 }).notNull().default("0"),
    credit: numeric("credit", { precision: 20, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("debit_credit_positive", sql`${t.debit} >= 0 AND ${t.credit} >= 0`),
    check("debit_or_credit", sql`NOT (${t.debit} > 0 AND ${t.credit} > 0)`),
  ]
);

// Type exports
export type GlAccount = typeof glAccounts.$inferSelect;
export type NewGlAccount = typeof glAccounts.$inferInsert;
export type JournalHeader = typeof journalHeaders.$inferSelect;
export type NewJournalHeader = typeof journalHeaders.$inferInsert;
export type JournalLine = typeof journalLines.$inferSelect;
export type NewJournalLine = typeof journalLines.$inferInsert;
