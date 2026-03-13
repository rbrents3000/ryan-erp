import {
  pgSchema,
  uuid,
  text,
  timestamp,
  numeric,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./system";

export const inventorySchema = pgSchema("inventory");

// Products
export const products = inventorySchema.table(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    partNumber: text("part_number").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    uomCode: text("uom_code").notNull().default("EA"),
    productType: text("product_type").notNull().default("stock"),
    productGroup: text("product_group"),
    standardCost: numeric("standard_cost", { precision: 20, scale: 2 }).notNull().default("0"),
    averageCost: numeric("average_cost", { precision: 20, scale: 2 }).notNull().default("0"),
    lastCost: numeric("last_cost", { precision: 20, scale: 2 }).notNull().default("0"),
    listPrice: numeric("list_price", { precision: 20, scale: 2 }).notNull().default("0"),
    weight: numeric("weight", { precision: 12, scale: 4 }),
    weightUom: text("weight_uom"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.partNumber)]
);

// Warehouses
export const warehouses = inventorySchema.table(
  "warehouses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    warehouseCode: text("warehouse_code").notNull(),
    name: text("name").notNull(),
    address: text("address"),
    isDefault: boolean("is_default").notNull().default(false),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.warehouseCode)]
);

// Product-Warehouse Stock
export const productWarehouse = inventorySchema.table(
  "product_warehouse",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id, { onDelete: "cascade" }),
    qtyOnHand: numeric("qty_on_hand", { precision: 20, scale: 4 }).notNull().default("0"),
    qtyReserved: numeric("qty_reserved", { precision: 20, scale: 4 }).notNull().default("0"),
    qtyOnOrder: numeric("qty_on_order", { precision: 20, scale: 4 }).notNull().default("0"),
    reorderPoint: numeric("reorder_point", { precision: 20, scale: 4 }),
    reorderQty: numeric("reorder_qty", { precision: 20, scale: 4 }),
    binLocation: text("bin_location"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.productId, t.warehouseId)]
);

// Stock Movements
export const stockMovements = inventorySchema.table("stock_movements", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  companyCode: text("company_code").notNull(),
  productId: uuid("product_id").notNull().references(() => products.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  movementType: text("movement_type").notNull(),
  quantity: numeric("quantity", { precision: 20, scale: 4 }).notNull(),
  referenceType: text("reference_type"),
  referenceId: uuid("reference_id"),
  notes: text("notes"),
  movementDate: timestamp("movement_date", { withTimezone: true }).notNull().defaultNow(),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Type exports
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;
