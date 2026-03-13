-- Enable RLS and create tenant isolation policies for all tables
-- Uses app_metadata.tenant_id from the JWT for secure isolation

-- Helper: extract tenant_id from JWT
CREATE OR REPLACE FUNCTION public.get_tenant_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
$$ LANGUAGE sql STABLE;

-- ============================================
-- SYSTEM SCHEMA
-- ============================================

ALTER TABLE system.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.tenants
  USING (id = public.get_tenant_id());

ALTER TABLE system.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.companies
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE system.divisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.divisions
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE system.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.user_profiles
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE system.currencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.currencies
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE system.units_of_measure ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.units_of_measure
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE system.terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.terms
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE system.tax_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.tax_codes
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE system.periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.periods
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE system.parameters ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system.parameters
  USING (tenant_id = public.get_tenant_id());

-- ============================================
-- FINANCE SCHEMA
-- ============================================

ALTER TABLE finance.gl_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON finance.gl_accounts
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE finance.gl_structure ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON finance.gl_structure
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE finance.journal_headers ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON finance.journal_headers
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE finance.journal_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON finance.journal_lines
  USING (tenant_id = public.get_tenant_id());

-- ============================================
-- INVENTORY SCHEMA
-- ============================================

ALTER TABLE inventory.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON inventory.products
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE inventory.warehouses ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON inventory.warehouses
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE inventory.product_warehouse ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON inventory.product_warehouse
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE inventory.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON inventory.stock_movements
  USING (tenant_id = public.get_tenant_id());

-- ============================================
-- PURCHASING SCHEMA
-- ============================================

ALTER TABLE purchasing.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON purchasing.vendors
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE purchasing.ap_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON purchasing.ap_invoices
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE purchasing.ap_invoice_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON purchasing.ap_invoice_lines
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE purchasing.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON purchasing.payments
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE purchasing.payment_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON purchasing.payment_allocations
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE purchasing.po_headers ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON purchasing.po_headers
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE purchasing.po_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON purchasing.po_lines
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE purchasing.goods_received ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON purchasing.goods_received
  USING (tenant_id = public.get_tenant_id());

-- ============================================
-- SALES SCHEMA
-- ============================================

ALTER TABLE sales.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON sales.customers
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE sales.ar_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON sales.ar_invoices
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE sales.cash_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON sales.cash_receipts
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE sales.cash_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON sales.cash_allocations
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE sales.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON sales.orders
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE sales.order_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON sales.order_lines
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE sales.despatch_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON sales.despatch_notes
  USING (tenant_id = public.get_tenant_id());

-- ============================================
-- PRODUCTION SCHEMA
-- ============================================

ALTER TABLE production.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON production.recipes
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE production.recipe_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON production.recipe_lines
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE production.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON production.jobs
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE production.job_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON production.job_materials
  USING (tenant_id = public.get_tenant_id());

ALTER TABLE production.job_labor ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON production.job_labor
  USING (tenant_id = public.get_tenant_id());
