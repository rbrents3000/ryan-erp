import {
  pgSchema,
  uuid,
  text,
  integer,
  timestamp,
  date,
  numeric,
  unique,
} from "drizzle-orm/pg-core";
import { tenants, periods } from "./system";
import { glAccounts, journalHeaders } from "./finance";

export const fixedAssetsSchema = pgSchema("fixed_assets");

// Assets
export const assets = fixedAssetsSchema.table(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    assetNumber: text("asset_number").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category"),
    location: text("location"),
    acquisitionDate: date("acquisition_date").notNull(),
    acquisitionCost: numeric("acquisition_cost", { precision: 20, scale: 2 }).notNull().default("0"),
    salvageValue: numeric("salvage_value", { precision: 20, scale: 2 }).notNull().default("0"),
    usefulLifeMonths: integer("useful_life_months").notNull().default(60),
    depreciationMethod: text("depreciation_method").notNull().default("straight_line"),
    accumulatedDepreciation: numeric("accumulated_depreciation", { precision: 20, scale: 2 }).notNull().default("0"),
    netBookValue: numeric("net_book_value", { precision: 20, scale: 2 }).notNull().default("0"),
    glAccountId: uuid("gl_account_id").references(() => glAccounts.id),
    depreciationAccountId: uuid("depreciation_account_id").references(() => glAccounts.id),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.assetNumber)]
);

// Depreciation Entries
export const depreciationEntries = fixedAssetsSchema.table("depreciation_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  assetId: uuid("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
  periodId: uuid("period_id").references(() => periods.id),
  depreciationDate: date("depreciation_date").notNull(),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  accumulatedTotal: numeric("accumulated_total", { precision: 20, scale: 2 }).notNull(),
  journalHeaderId: uuid("journal_header_id").references(() => journalHeaders.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Type exports
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type DepreciationEntry = typeof depreciationEntries.$inferSelect;
