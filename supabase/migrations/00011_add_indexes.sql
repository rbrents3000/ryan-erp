-- Performance indexes for foreign keys and common query patterns
-- Note: unique constraints already create implicit indexes

-- ============================================
-- SYSTEM SCHEMA
-- ============================================

CREATE INDEX idx_user_profiles_tenant ON system.user_profiles(tenant_id);
CREATE INDEX idx_periods_tenant_company ON system.periods(tenant_id, company_code);

-- Soft-delete partial indexes (filter out deleted rows efficiently)
CREATE INDEX idx_companies_active ON system.companies(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_currencies_active ON system.currencies(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_uom_active ON system.units_of_measure(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_terms_active ON system.terms(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tax_codes_active ON system.tax_codes(tenant_id) WHERE deleted_at IS NULL;

-- ============================================
-- FINANCE SCHEMA
-- ============================================

CREATE INDEX idx_gl_accounts_active ON finance.gl_accounts(tenant_id, company_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_gl_accounts_parent ON finance.gl_accounts(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_journal_headers_tenant_company ON finance.journal_headers(tenant_id, company_code, status);
CREATE INDEX idx_journal_headers_period ON finance.journal_headers(period_id);
CREATE INDEX idx_journal_lines_header ON finance.journal_lines(journal_header_id);
CREATE INDEX idx_journal_lines_account ON finance.journal_lines(account_id);

-- ============================================
-- INVENTORY SCHEMA
-- ============================================

CREATE INDEX idx_products_active ON inventory.products(tenant_id, company_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_warehouses_active ON inventory.warehouses(tenant_id, company_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_warehouse_product ON inventory.product_warehouse(product_id);
CREATE INDEX idx_product_warehouse_warehouse ON inventory.product_warehouse(warehouse_id);
CREATE INDEX idx_stock_movements_product ON inventory.stock_movements(product_id);
CREATE INDEX idx_stock_movements_warehouse ON inventory.stock_movements(warehouse_id);
CREATE INDEX idx_stock_movements_tenant_date ON inventory.stock_movements(tenant_id, company_code, created_at);

-- ============================================
-- PURCHASING SCHEMA
-- ============================================

CREATE INDEX idx_vendors_active ON purchasing.vendors(tenant_id, company_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_ap_invoices_vendor ON purchasing.ap_invoices(vendor_id);
CREATE INDEX idx_ap_invoices_status ON purchasing.ap_invoices(tenant_id, company_code, status);
CREATE INDEX idx_ap_invoice_lines_invoice ON purchasing.ap_invoice_lines(invoice_id);
CREATE INDEX idx_payments_vendor ON purchasing.payments(vendor_id);
CREATE INDEX idx_payment_alloc_payment ON purchasing.payment_allocations(payment_id);
CREATE INDEX idx_payment_alloc_invoice ON purchasing.payment_allocations(invoice_id);
CREATE INDEX idx_po_headers_vendor ON purchasing.po_headers(vendor_id);
CREATE INDEX idx_po_headers_status ON purchasing.po_headers(tenant_id, company_code, status);
CREATE INDEX idx_po_lines_header ON purchasing.po_lines(po_header_id);
CREATE INDEX idx_po_lines_product ON purchasing.po_lines(product_id);
CREATE INDEX idx_goods_received_po ON purchasing.goods_received(po_header_id);

-- ============================================
-- SALES SCHEMA
-- ============================================

CREATE INDEX idx_customers_active ON sales.customers(tenant_id, company_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_ar_invoices_customer ON sales.ar_invoices(customer_id);
CREATE INDEX idx_ar_invoices_status ON sales.ar_invoices(tenant_id, company_code, status);
CREATE INDEX idx_cash_receipts_customer ON sales.cash_receipts(customer_id);
CREATE INDEX idx_cash_alloc_receipt ON sales.cash_allocations(receipt_id);
CREATE INDEX idx_cash_alloc_invoice ON sales.cash_allocations(invoice_id);
CREATE INDEX idx_orders_customer ON sales.orders(customer_id);
CREATE INDEX idx_orders_status ON sales.orders(tenant_id, company_code, status);
CREATE INDEX idx_order_lines_order ON sales.order_lines(order_id);
CREATE INDEX idx_order_lines_product ON sales.order_lines(product_id);
CREATE INDEX idx_despatch_order ON sales.despatch_notes(order_id);
CREATE INDEX idx_despatch_customer ON sales.despatch_notes(customer_id);

-- ============================================
-- PRODUCTION SCHEMA
-- ============================================

CREATE INDEX idx_recipes_active ON production.recipes(tenant_id, company_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_recipes_product ON production.recipes(output_product_id);
CREATE INDEX idx_recipe_lines_recipe ON production.recipe_lines(recipe_id);
CREATE INDEX idx_recipe_lines_component ON production.recipe_lines(component_product_id);
CREATE INDEX idx_jobs_recipe ON production.jobs(recipe_id);
CREATE INDEX idx_jobs_status ON production.jobs(tenant_id, company_code, status);
CREATE INDEX idx_job_materials_job ON production.job_materials(job_id);
CREATE INDEX idx_job_materials_product ON production.job_materials(product_id);
CREATE INDEX idx_job_labor_job ON production.job_labor(job_id);
