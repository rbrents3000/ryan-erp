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

export const systemSchema = pgSchema("system");

// Tenants
export const tenants = systemSchema.table("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Companies
export const companies = systemSchema.table(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    name: text("name").notNull(),
    baseCurrency: text("base_currency").notNull().default("USD"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country").default("US"),
    phone: text("phone"),
    email: text("email"),
    taxId: text("tax_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.companyCode)]
);

// Divisions
export const divisions = systemSchema.table(
  "divisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    divisionCode: text("division_code").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.divisionCode)]
);

// User Profiles
export const userProfiles = systemSchema.table("user_profiles", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  defaultCompanyCode: text("default_company_code").notNull().default("01"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Currencies
export const currencies = systemSchema.table(
  "currencies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    symbol: text("symbol").notNull().default("$"),
    decimalPlaces: integer("decimal_places").notNull().default(2),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.code)]
);

// Units of Measure
export const unitsOfMeasure = systemSchema.table(
  "units_of_measure",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    uomType: text("uom_type").notNull().default("unit"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.code)]
);

// Payment Terms
export const terms = systemSchema.table(
  "terms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    description: text("description").notNull(),
    daysDue: integer("days_due").notNull().default(30),
    discountPct: numeric("discount_pct", { precision: 5, scale: 2 }).notNull().default("0"),
    discountDays: integer("discount_days").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.code)]
);

// Tax Codes
export const taxCodes = systemSchema.table(
  "tax_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    description: text("description").notNull(),
    rate: numeric("rate", { precision: 7, scale: 4 }).notNull().default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.code)]
);

// Accounting Periods
export const periods = systemSchema.table(
  "periods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    fiscalYear: integer("fiscal_year").notNull(),
    periodNum: integer("period_num").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    status: text("status").notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.fiscalYear, t.periodNum)]
);

// System Parameters
export const parameters = systemSchema.table(
  "parameters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code"),
    key: text("key").notNull(),
    value: text("value"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.key)]
);

// Number Sequences
export const numberSequences = systemSchema.table(
  "number_sequences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    documentType: text("document_type").notNull(),
    prefix: text("prefix").notNull().default(""),
    nextNumber: integer("next_number").notNull().default(1),
    padLength: integer("pad_length").notNull().default(6),
    resetYearly: text("reset_yearly").notNull().default("false"),
    currentYear: integer("current_year"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.documentType)]
);

// Type exports
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Currency = typeof currencies.$inferSelect;
export type UnitOfMeasure = typeof unitsOfMeasure.$inferSelect;
export type Term = typeof terms.$inferSelect;
export type TaxCode = typeof taxCodes.$inferSelect;
export type Period = typeof periods.$inferSelect;
export type NumberSequence = typeof numberSequences.$inferSelect;
