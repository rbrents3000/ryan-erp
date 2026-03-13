-- Tenants (SaaS customer boundary)
CREATE TABLE system.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON system.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Companies (within a tenant)
CREATE TABLE system.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  name TEXT NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  phone TEXT,
  email TEXT,
  tax_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, company_code)
);

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON system.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Divisions
CREATE TABLE system.divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  division_code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, company_code, division_code)
);

CREATE TRIGGER update_divisions_updated_at
  BEFORE UPDATE ON system.divisions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- User profiles (extends auth.users)
CREATE TABLE system.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  display_name TEXT,
  default_company_code TEXT NOT NULL DEFAULT '01',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON system.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Currencies
CREATE TABLE system.currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL DEFAULT '$',
  decimal_places INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);

CREATE TRIGGER update_currencies_updated_at
  BEFORE UPDATE ON system.currencies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Units of Measure
CREATE TABLE system.units_of_measure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  uom_type TEXT NOT NULL DEFAULT 'unit',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);

CREATE TRIGGER update_uom_updated_at
  BEFORE UPDATE ON system.units_of_measure
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Payment / Credit Terms
CREATE TABLE system.terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  days_due INTEGER NOT NULL DEFAULT 30,
  discount_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);

CREATE TRIGGER update_terms_updated_at
  BEFORE UPDATE ON system.terms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Tax Codes
CREATE TABLE system.tax_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  rate NUMERIC(7,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, code)
);

CREATE TRIGGER update_tax_codes_updated_at
  BEFORE UPDATE ON system.tax_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Accounting Periods
CREATE TABLE system.periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  period_num INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'future')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, fiscal_year, period_num)
);

CREATE TRIGGER update_periods_updated_at
  BEFORE UPDATE ON system.periods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- System Parameters (key-value config)
CREATE TABLE system.parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT,
  key TEXT NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, key)
);

CREATE TRIGGER update_parameters_updated_at
  BEFORE UPDATE ON system.parameters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
