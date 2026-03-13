-- Customers
CREATE TABLE sales.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  customer_number TEXT NOT NULL,
  name TEXT NOT NULL,
  contact_name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  phone TEXT,
  email TEXT,
  tax_id TEXT,
  terms_code TEXT,
  credit_limit NUMERIC(20,2) NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, company_code, customer_number)
);

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON sales.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- AR Invoices
CREATE TABLE sales.ar_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES sales.customers(id),
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  terms_code TEXT,
  subtotal NUMERIC(20,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  amount_received NUMERIC(20,2) NOT NULL DEFAULT 0,
  balance_due NUMERIC(20,2) NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'partial', 'paid', 'void')),
  order_id UUID,
  gl_account_id UUID REFERENCES finance.gl_accounts(id),
  period_id UUID REFERENCES system.periods(id),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, invoice_number)
);

CREATE TRIGGER update_ar_invoices_updated_at
  BEFORE UPDATE ON sales.ar_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Cash Receipts
CREATE TABLE sales.cash_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES sales.customers(id),
  receipt_date DATE NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'check' CHECK (payment_method IN ('check', 'ach', 'wire', 'card', 'cash')),
  reference_number TEXT,
  amount NUMERIC(20,2) NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  gl_account_id UUID REFERENCES finance.gl_accounts(id),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_cash_receipts_updated_at
  BEFORE UPDATE ON sales.cash_receipts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Cash Receipt Allocations
CREATE TABLE sales.cash_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  receipt_id UUID NOT NULL REFERENCES sales.cash_receipts(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES sales.ar_invoices(id),
  amount NUMERIC(20,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sales Orders
CREATE TABLE sales.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  order_number TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES sales.customers(id),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  required_date DATE,
  ship_to_name TEXT,
  ship_to_address TEXT,
  ship_to_city TEXT,
  ship_to_state TEXT,
  ship_to_postal_code TEXT,
  ship_to_country TEXT DEFAULT 'US',
  subtotal NUMERIC(20,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'shipped', 'invoiced', 'closed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, order_number)
);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON sales.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Sales Order Lines
CREATE TABLE sales.order_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES sales.orders(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  product_id UUID NOT NULL REFERENCES inventory.products(id),
  description TEXT,
  quantity NUMERIC(20,4) NOT NULL,
  unit_price NUMERIC(20,4) NOT NULL DEFAULT 0,
  discount_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  qty_shipped NUMERIC(20,4) NOT NULL DEFAULT 0,
  uom_code TEXT NOT NULL DEFAULT 'EA',
  warehouse_id UUID REFERENCES inventory.warehouses(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_order_lines_updated_at
  BEFORE UPDATE ON sales.order_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Despatch Notes
CREATE TABLE sales.despatch_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  despatch_number TEXT NOT NULL,
  order_id UUID NOT NULL REFERENCES sales.orders(id),
  customer_id UUID NOT NULL REFERENCES sales.customers(id),
  despatch_date DATE NOT NULL DEFAULT CURRENT_DATE,
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
  carrier TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, despatch_number)
);
