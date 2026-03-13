-- Chart of Accounts
CREATE TABLE finance.gl_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  is_header BOOLEAN NOT NULL DEFAULT false,
  is_posting BOOLEAN NOT NULL DEFAULT true,
  parent_id UUID REFERENCES finance.gl_accounts(id),
  normal_balance TEXT NOT NULL DEFAULT 'debit' CHECK (normal_balance IN ('debit', 'credit')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, company_code, account_number)
);

CREATE TRIGGER update_gl_accounts_updated_at
  BEFORE UPDATE ON finance.gl_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Account Structure Definition
CREATE TABLE finance.gl_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  segment_name TEXT NOT NULL,
  segment_order INTEGER NOT NULL,
  segment_length INTEGER NOT NULL,
  separator TEXT NOT NULL DEFAULT '-',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, segment_order)
);

CREATE TRIGGER update_gl_structure_updated_at
  BEFORE UPDATE ON finance.gl_structure
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Journal Entry Headers
CREATE TABLE finance.journal_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  journal_number SERIAL,
  journal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  period_id UUID REFERENCES system.periods(id),
  description TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'reversed')),
  posted_at TIMESTAMPTZ,
  posted_by UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_journal_headers_updated_at
  BEFORE UPDATE ON finance.journal_headers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Journal Entry Lines
CREATE TABLE finance.journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  journal_header_id UUID NOT NULL REFERENCES finance.journal_headers(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  account_id UUID NOT NULL REFERENCES finance.gl_accounts(id),
  description TEXT,
  debit NUMERIC(20,2) NOT NULL DEFAULT 0,
  credit NUMERIC(20,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (debit >= 0 AND credit >= 0),
  CHECK (NOT (debit > 0 AND credit > 0))
);

CREATE TRIGGER update_journal_lines_updated_at
  BEFORE UPDATE ON finance.journal_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
