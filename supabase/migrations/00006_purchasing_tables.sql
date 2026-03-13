-- Vendors
CREATE TABLE purchasing.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  vendor_number TEXT NOT NULL,
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
  currency_code TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, company_code, vendor_number)
);

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON purchasing.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- AP Invoices
CREATE TABLE purchasing.ap_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  vendor_id UUID NOT NULL REFERENCES purchasing.vendors(id),
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  terms_code TEXT,
  subtotal NUMERIC(20,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(20,2) NOT NULL DEFAULT 0,
  balance_due NUMERIC(20,2) NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'partial', 'paid', 'void')),
  gl_account_id UUID REFERENCES finance.gl_accounts(id),
  period_id UUID REFERENCES system.periods(id),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, vendor_id, invoice_number)
);

CREATE TRIGGER update_ap_invoices_updated_at
  BEFORE UPDATE ON purchasing.ap_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- AP Invoice Lines
CREATE TABLE purchasing.ap_invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES purchasing.ap_invoices(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  gl_account_id UUID REFERENCES finance.gl_accounts(id),
  quantity NUMERIC(20,4) NOT NULL DEFAULT 1,
  unit_price NUMERIC(20,4) NOT NULL DEFAULT 0,
  amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  tax_code TEXT,
  tax_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_ap_invoice_lines_updated_at
  BEFORE UPDATE ON purchasing.ap_invoice_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Payments
CREATE TABLE purchasing.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  vendor_id UUID NOT NULL REFERENCES purchasing.vendors(id),
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'check' CHECK (payment_method IN ('check', 'ach', 'wire', 'card')),
  check_number TEXT,
  amount NUMERIC(20,2) NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  gl_account_id UUID REFERENCES finance.gl_accounts(id),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON purchasing.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Payment Allocations (payment → invoice mapping)
CREATE TABLE purchasing.payment_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES purchasing.payments(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES purchasing.ap_invoices(id),
  amount NUMERIC(20,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Purchase Order Headers
CREATE TABLE purchasing.po_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  po_number TEXT NOT NULL,
  vendor_id UUID NOT NULL REFERENCES purchasing.vendors(id),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_date DATE,
  ship_to_warehouse_id UUID REFERENCES inventory.warehouses(id),
  subtotal NUMERIC(20,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'partial', 'received', 'closed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, po_number)
);

CREATE TRIGGER update_po_headers_updated_at
  BEFORE UPDATE ON purchasing.po_headers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Purchase Order Lines
CREATE TABLE purchasing.po_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  po_header_id UUID NOT NULL REFERENCES purchasing.po_headers(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  product_id UUID REFERENCES inventory.products(id),
  description TEXT NOT NULL,
  quantity NUMERIC(20,4) NOT NULL,
  unit_price NUMERIC(20,4) NOT NULL DEFAULT 0,
  amount NUMERIC(20,2) NOT NULL DEFAULT 0,
  qty_received NUMERIC(20,4) NOT NULL DEFAULT 0,
  uom_code TEXT NOT NULL DEFAULT 'EA',
  gl_account_id UUID REFERENCES finance.gl_accounts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_po_lines_updated_at
  BEFORE UPDATE ON purchasing.po_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Goods Received
CREATE TABLE purchasing.goods_received (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  grn_number TEXT NOT NULL,
  po_header_id UUID NOT NULL REFERENCES purchasing.po_headers(id),
  vendor_id UUID NOT NULL REFERENCES purchasing.vendors(id),
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, grn_number)
);
