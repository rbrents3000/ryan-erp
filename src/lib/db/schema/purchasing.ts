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
import { tenants, periods } from "./system";
import { glAccounts } from "./finance";
import { products, warehouses } from "./inventory";

export const purchasingSchema = pgSchema("purchasing");

// Vendors
export const vendors = purchasingSchema.table(
  "vendors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    vendorNumber: text("vendor_number").notNull(),
    name: text("name").notNull(),
    contactName: text("contact_name"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country").default("US"),
    phone: text("phone"),
    email: text("email"),
    taxId: text("tax_id"),
    termsCode: text("terms_code"),
    currencyCode: text("currency_code").notNull().default("USD"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.vendorNumber)]
);

// AP Invoices
export const apInvoices = purchasingSchema.table(
  "ap_invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    vendorId: uuid("vendor_id").notNull().references(() => vendors.id),
    invoiceNumber: text("invoice_number").notNull(),
    invoiceDate: date("invoice_date").notNull(),
    dueDate: date("due_date").notNull(),
    termsCode: text("terms_code"),
    subtotal: numeric("subtotal", { precision: 20, scale: 2 }).notNull().default("0"),
    taxAmount: numeric("tax_amount", { precision: 20, scale: 2 }).notNull().default("0"),
    totalAmount: numeric("total_amount", { precision: 20, scale: 2 }).notNull().default("0"),
    amountPaid: numeric("amount_paid", { precision: 20, scale: 2 }).notNull().default("0"),
    balanceDue: numeric("balance_due", { precision: 20, scale: 2 }).notNull().default("0"),
    currencyCode: text("currency_code").notNull().default("USD"),
    status: text("status").notNull().default("open"),
    glAccountId: uuid("gl_account_id").references(() => glAccounts.id),
    periodId: uuid("period_id").references(() => periods.id),
    notes: text("notes"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.vendorId, t.invoiceNumber)]
);

// AP Invoice Lines
export const apInvoiceLines = purchasingSchema.table("ap_invoice_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").notNull().references(() => apInvoices.id, { onDelete: "cascade" }),
  lineNumber: integer("line_number").notNull(),
  description: text("description").notNull(),
  glAccountId: uuid("gl_account_id").references(() => glAccounts.id),
  quantity: numeric("quantity", { precision: 20, scale: 4 }).notNull().default("1"),
  unitPrice: numeric("unit_price", { precision: 20, scale: 4 }).notNull().default("0"),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull().default("0"),
  taxCode: text("tax_code"),
  taxAmount: numeric("tax_amount", { precision: 20, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Payments
export const payments = purchasingSchema.table("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  companyCode: text("company_code").notNull(),
  vendorId: uuid("vendor_id").notNull().references(() => vendors.id),
  paymentDate: date("payment_date").notNull(),
  paymentMethod: text("payment_method").notNull().default("check"),
  checkNumber: text("check_number"),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  currencyCode: text("currency_code").notNull().default("USD"),
  glAccountId: uuid("gl_account_id").references(() => glAccounts.id),
  notes: text("notes"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Payment Allocations
export const paymentAllocations = purchasingSchema.table("payment_allocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  paymentId: uuid("payment_id").notNull().references(() => payments.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").notNull().references(() => apInvoices.id),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// PO Headers
export const poHeaders = purchasingSchema.table(
  "po_headers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    poNumber: text("po_number").notNull(),
    vendorId: uuid("vendor_id").notNull().references(() => vendors.id),
    orderDate: date("order_date").notNull().default(sql`CURRENT_DATE`),
    expectedDate: date("expected_date"),
    shipToWarehouseId: uuid("ship_to_warehouse_id").references(() => warehouses.id),
    subtotal: numeric("subtotal", { precision: 20, scale: 2 }).notNull().default("0"),
    taxAmount: numeric("tax_amount", { precision: 20, scale: 2 }).notNull().default("0"),
    totalAmount: numeric("total_amount", { precision: 20, scale: 2 }).notNull().default("0"),
    currencyCode: text("currency_code").notNull().default("USD"),
    status: text("status").notNull().default("draft"),
    notes: text("notes"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.poNumber)]
);

// PO Lines
export const poLines = purchasingSchema.table("po_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  poHeaderId: uuid("po_header_id").notNull().references(() => poHeaders.id, { onDelete: "cascade" }),
  lineNumber: integer("line_number").notNull(),
  productId: uuid("product_id").references(() => products.id),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 20, scale: 4 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 20, scale: 4 }).notNull().default("0"),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull().default("0"),
  qtyReceived: numeric("qty_received", { precision: 20, scale: 4 }).notNull().default("0"),
  uomCode: text("uom_code").notNull().default("EA"),
  glAccountId: uuid("gl_account_id").references(() => glAccounts.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Goods Received
export const goodsReceived = purchasingSchema.table(
  "goods_received",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    grnNumber: text("grn_number").notNull(),
    poHeaderId: uuid("po_header_id").notNull().references(() => poHeaders.id),
    vendorId: uuid("vendor_id").notNull().references(() => vendors.id),
    receivedDate: date("received_date").notNull().default(sql`CURRENT_DATE`),
    warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
    notes: text("notes"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.grnNumber)]
);

// Type exports
export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
export type ApInvoice = typeof apInvoices.$inferSelect;
export type PoHeader = typeof poHeaders.$inferSelect;
