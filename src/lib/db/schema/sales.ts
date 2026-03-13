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

export const salesSchema = pgSchema("sales");

// Customers
export const customers = salesSchema.table(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    customerNumber: text("customer_number").notNull(),
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
    creditLimit: numeric("credit_limit", { precision: 20, scale: 2 }).notNull().default("0"),
    currencyCode: text("currency_code").notNull().default("USD"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.customerNumber)]
);

// AR Invoices
export const arInvoices = salesSchema.table(
  "ar_invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    invoiceNumber: text("invoice_number").notNull(),
    invoiceDate: date("invoice_date").notNull(),
    dueDate: date("due_date").notNull(),
    termsCode: text("terms_code"),
    subtotal: numeric("subtotal", { precision: 20, scale: 2 }).notNull().default("0"),
    taxAmount: numeric("tax_amount", { precision: 20, scale: 2 }).notNull().default("0"),
    totalAmount: numeric("total_amount", { precision: 20, scale: 2 }).notNull().default("0"),
    amountReceived: numeric("amount_received", { precision: 20, scale: 2 }).notNull().default("0"),
    balanceDue: numeric("balance_due", { precision: 20, scale: 2 }).notNull().default("0"),
    currencyCode: text("currency_code").notNull().default("USD"),
    status: text("status").notNull().default("open"),
    orderId: uuid("order_id"),
    glAccountId: uuid("gl_account_id").references(() => glAccounts.id),
    periodId: uuid("period_id").references(() => periods.id),
    notes: text("notes"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.invoiceNumber)]
);

// Cash Receipts
export const cashReceipts = salesSchema.table("cash_receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  companyCode: text("company_code").notNull(),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  receiptDate: date("receipt_date").notNull(),
  paymentMethod: text("payment_method").notNull().default("check"),
  referenceNumber: text("reference_number"),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  currencyCode: text("currency_code").notNull().default("USD"),
  glAccountId: uuid("gl_account_id").references(() => glAccounts.id),
  notes: text("notes"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Cash Allocations
export const cashAllocations = salesSchema.table("cash_allocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  receiptId: uuid("receipt_id").notNull().references(() => cashReceipts.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").notNull().references(() => arInvoices.id),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Sales Orders
export const orders = salesSchema.table(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    orderNumber: text("order_number").notNull(),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    orderDate: date("order_date").notNull().default(sql`CURRENT_DATE`),
    requiredDate: date("required_date"),
    shipToName: text("ship_to_name"),
    shipToAddress: text("ship_to_address"),
    shipToCity: text("ship_to_city"),
    shipToState: text("ship_to_state"),
    shipToPostalCode: text("ship_to_postal_code"),
    shipToCountry: text("ship_to_country").default("US"),
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
  (t) => [unique().on(t.tenantId, t.companyCode, t.orderNumber)]
);

// Order Lines
export const orderLines = salesSchema.table("order_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  lineNumber: integer("line_number").notNull(),
  productId: uuid("product_id").notNull().references(() => products.id),
  description: text("description"),
  quantity: numeric("quantity", { precision: 20, scale: 4 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 20, scale: 4 }).notNull().default("0"),
  discountPct: numeric("discount_pct", { precision: 5, scale: 2 }).notNull().default("0"),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull().default("0"),
  qtyShipped: numeric("qty_shipped", { precision: 20, scale: 4 }).notNull().default("0"),
  uomCode: text("uom_code").notNull().default("EA"),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Despatch Notes
export const despatchNotes = salesSchema.table(
  "despatch_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    companyCode: text("company_code").notNull(),
    despatchNumber: text("despatch_number").notNull(),
    orderId: uuid("order_id").notNull().references(() => orders.id),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    despatchDate: date("despatch_date").notNull().default(sql`CURRENT_DATE`),
    warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
    carrier: text("carrier"),
    trackingNumber: text("tracking_number"),
    notes: text("notes"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.tenantId, t.companyCode, t.despatchNumber)]
);

// Type exports
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type ArInvoice = typeof arInvoices.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
