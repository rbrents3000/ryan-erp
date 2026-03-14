-- Add INSERT/UPDATE/DELETE RLS policies for all tenant-scoped tables
-- Defense-in-depth: app uses Drizzle (direct Postgres) but these protect PostgREST access

-- ============================================
-- SYSTEM SCHEMA
-- ============================================

CREATE POLICY tenant_insert ON system.companies
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON system.companies
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON system.companies
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON system.divisions
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON system.divisions
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON system.divisions
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON system.user_profiles
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON system.user_profiles
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON system.currencies
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON system.currencies
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON system.currencies
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON system.units_of_measure
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON system.units_of_measure
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON system.units_of_measure
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON system.terms
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON system.terms
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON system.terms
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON system.tax_codes
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON system.tax_codes
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON system.tax_codes
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON system.periods
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON system.periods
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON system.periods
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON system.parameters
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON system.parameters
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON system.parameters
  FOR DELETE USING (tenant_id = public.get_tenant_id());

-- ============================================
-- FINANCE SCHEMA
-- ============================================

CREATE POLICY tenant_insert ON finance.gl_accounts
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON finance.gl_accounts
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON finance.gl_accounts
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON finance.gl_structure
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON finance.gl_structure
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON finance.gl_structure
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON finance.journal_headers
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON finance.journal_headers
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON finance.journal_lines
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON finance.journal_lines
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

-- ============================================
-- INVENTORY SCHEMA
-- ============================================

CREATE POLICY tenant_insert ON inventory.products
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON inventory.products
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON inventory.products
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON inventory.warehouses
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON inventory.warehouses
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON inventory.warehouses
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON inventory.product_warehouse
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON inventory.product_warehouse
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON inventory.stock_movements
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());

-- ============================================
-- PURCHASING SCHEMA
-- ============================================

CREATE POLICY tenant_insert ON purchasing.vendors
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON purchasing.vendors
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON purchasing.vendors
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON purchasing.ap_invoices
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON purchasing.ap_invoices
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON purchasing.ap_invoice_lines
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON purchasing.ap_invoice_lines
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON purchasing.payments
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON purchasing.payments
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON purchasing.payment_allocations
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON purchasing.payment_allocations
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON purchasing.po_headers
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON purchasing.po_headers
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON purchasing.po_lines
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON purchasing.po_lines
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON purchasing.goods_received
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON purchasing.goods_received
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

-- ============================================
-- SALES SCHEMA
-- ============================================

CREATE POLICY tenant_insert ON sales.customers
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON sales.customers
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON sales.customers
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON sales.ar_invoices
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON sales.ar_invoices
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON sales.cash_receipts
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON sales.cash_receipts
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON sales.cash_allocations
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON sales.cash_allocations
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON sales.orders
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON sales.orders
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON sales.order_lines
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON sales.order_lines
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON sales.despatch_notes
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON sales.despatch_notes
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

-- ============================================
-- PRODUCTION SCHEMA
-- ============================================

CREATE POLICY tenant_insert ON production.recipes
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON production.recipes
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_delete ON production.recipes
  FOR DELETE USING (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON production.recipe_lines
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON production.recipe_lines
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON production.jobs
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON production.jobs
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON production.job_materials
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON production.job_materials
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());

CREATE POLICY tenant_insert ON production.job_labor
  FOR INSERT WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY tenant_update ON production.job_labor
  FOR UPDATE USING (tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id = public.get_tenant_id());
