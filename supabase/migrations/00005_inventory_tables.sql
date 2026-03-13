-- Products
CREATE TABLE inventory.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  part_number TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  uom_code TEXT NOT NULL DEFAULT 'EA',
  product_type TEXT NOT NULL DEFAULT 'stock' CHECK (product_type IN ('stock', 'non-stock', 'service')),
  product_group TEXT,
  standard_cost NUMERIC(20,2) NOT NULL DEFAULT 0,
  average_cost NUMERIC(20,2) NOT NULL DEFAULT 0,
  last_cost NUMERIC(20,2) NOT NULL DEFAULT 0,
  list_price NUMERIC(20,2) NOT NULL DEFAULT 0,
  weight NUMERIC(12,4),
  weight_uom TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, company_code, part_number)
);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON inventory.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Warehouses
CREATE TABLE inventory.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  warehouse_code TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, company_code, warehouse_code)
);

CREATE TRIGGER update_warehouses_updated_at
  BEFORE UPDATE ON inventory.warehouses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Product-Warehouse Stock (on-hand per location)
CREATE TABLE inventory.product_warehouse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES inventory.products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id) ON DELETE CASCADE,
  qty_on_hand NUMERIC(20,4) NOT NULL DEFAULT 0,
  qty_reserved NUMERIC(20,4) NOT NULL DEFAULT 0,
  qty_on_order NUMERIC(20,4) NOT NULL DEFAULT 0,
  reorder_point NUMERIC(20,4),
  reorder_qty NUMERIC(20,4),
  bin_location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, warehouse_id)
);

CREATE TRIGGER update_product_warehouse_updated_at
  BEFORE UPDATE ON inventory.product_warehouse
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Stock Movements
CREATE TABLE inventory.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES inventory.products(id),
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('receipt', 'issue', 'adjustment', 'transfer_in', 'transfer_out')),
  quantity NUMERIC(20,4) NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  movement_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
