-- Create fixed_assets schema
CREATE SCHEMA IF NOT EXISTS fixed_assets;

-- Assets
CREATE TABLE fixed_assets.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  asset_number TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location TEXT,
  acquisition_date DATE NOT NULL,
  acquisition_cost NUMERIC(20,2) NOT NULL DEFAULT 0,
  salvage_value NUMERIC(20,2) NOT NULL DEFAULT 0,
  useful_life_months INTEGER NOT NULL DEFAULT 60,
  depreciation_method TEXT NOT NULL DEFAULT 'straight_line' CHECK (depreciation_method IN ('straight_line', 'declining_balance')),
  accumulated_depreciation NUMERIC(20,2) NOT NULL DEFAULT 0,
  net_book_value NUMERIC(20,2) NOT NULL DEFAULT 0,
  gl_account_id UUID REFERENCES finance.gl_accounts(id),
  depreciation_account_id UUID REFERENCES finance.gl_accounts(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disposed', 'fully_depreciated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, company_code, asset_number)
);

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON fixed_assets.assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Depreciation Entries
CREATE TABLE fixed_assets.depreciation_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES fixed_assets.assets(id) ON DELETE CASCADE,
  period_id UUID REFERENCES system.periods(id),
  depreciation_date DATE NOT NULL,
  amount NUMERIC(20,2) NOT NULL,
  accumulated_total NUMERIC(20,2) NOT NULL,
  journal_header_id UUID REFERENCES finance.journal_headers(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS policies
ALTER TABLE fixed_assets.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_assets.depreciation_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON fixed_assets.assets
  USING (tenant_id = (current_setting('app.tenant_id', true))::uuid);

CREATE POLICY "tenant_isolation" ON fixed_assets.depreciation_entries
  USING (tenant_id = (current_setting('app.tenant_id', true))::uuid);

-- Indexes
CREATE INDEX idx_assets_tenant ON fixed_assets.assets(tenant_id, company_code);
CREATE INDEX idx_depreciation_entries_asset ON fixed_assets.depreciation_entries(asset_id);
