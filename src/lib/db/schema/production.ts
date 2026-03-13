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
import { sql } from "drizzle-orm";
import { tenants } from "./system";
import { products, warehouses } from "./inventory";

export const productionSchema = pgSchema("production");

// Recipes (BOM)
export const recipes = productionSchema.table(
  "recipes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    recipeCode: text("recipe_code").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    outputProductId: uuid("output_product_id").notNull().references(() => products.id),
    outputQuantity: numeric("output_quantity", { precision: 20, scale: 4 }).notNull().default("1"),
    outputUom: text("output_uom").notNull().default("EA"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.recipeCode)]
);

// Recipe Lines (BOM components)
export const recipeLines = productionSchema.table("recipe_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
  lineNumber: integer("line_number").notNull(),
  componentProductId: uuid("component_product_id").notNull().references(() => products.id),
  quantity: numeric("quantity", { precision: 20, scale: 6 }).notNull(),
  uomCode: text("uom_code").notNull().default("EA"),
  scrapPct: numeric("scrap_pct", { precision: 5, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Production Jobs
export const jobs = productionSchema.table(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    jobNumber: text("job_number").notNull(),
    recipeId: uuid("recipe_id").notNull().references(() => recipes.id),
    plannedQuantity: numeric("planned_quantity", { precision: 20, scale: 4 }).notNull(),
    actualQuantity: numeric("actual_quantity", { precision: 20, scale: 4 }).notNull().default("0"),
    plannedStart: date("planned_start"),
    plannedEnd: date("planned_end"),
    actualStart: date("actual_start"),
    actualEnd: date("actual_end"),
    warehouseId: uuid("warehouse_id").references(() => warehouses.id),
    status: text("status").notNull().default("planned"),
    notes: text("notes"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.jobNumber)]
);

// Job Material Issues
export const jobMaterials = productionSchema.table("job_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  plannedQuantity: numeric("planned_quantity", { precision: 20, scale: 4 }).notNull().default("0"),
  issuedQuantity: numeric("issued_quantity", { precision: 20, scale: 4 }).notNull().default("0"),
  returnedQuantity: numeric("returned_quantity", { precision: 20, scale: 4 }).notNull().default("0"),
  uomCode: text("uom_code").notNull().default("EA"),
  issueDate: timestamp("issue_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Job Labor (Time Cards)
export const jobLabor = productionSchema.table("job_labor", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  employeeName: text("employee_name").notNull(),
  workDate: date("work_date").notNull(),
  hoursWorked: numeric("hours_worked", { precision: 8, scale: 2 }).notNull(),
  laborRate: numeric("labor_rate", { precision: 12, scale: 2 }).notNull().default("0"),
  laborCost: numeric("labor_cost", { precision: 20, scale: 2 }).notNull().default("0"),
  operation: text("operation"),
  notes: text("notes"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Type exports
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
