-- Document numbering sequences
CREATE TABLE system.number_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  document_type TEXT NOT NULL,
  prefix TEXT NOT NULL DEFAULT '',
  next_number INTEGER NOT NULL DEFAULT 1,
  pad_length INTEGER NOT NULL DEFAULT 6,
  reset_yearly BOOLEAN NOT NULL DEFAULT false,
  current_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, document_type)
);

ALTER TABLE system.number_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON system.number_sequences
  USING (tenant_id = (current_setting('app.tenant_id', true))::uuid);

CREATE TRIGGER update_number_sequences_updated_at
  BEFORE UPDATE ON system.number_sequences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Atomic next-number function (prevents duplicates under concurrency)
CREATE OR REPLACE FUNCTION system.get_next_number(
  p_tenant_id UUID,
  p_company_code TEXT,
  p_document_type TEXT
) RETURNS TEXT AS $$
DECLARE
  v_prefix TEXT;
  v_next INTEGER;
  v_pad INTEGER;
  v_reset BOOLEAN;
  v_year INTEGER;
  v_current_year INTEGER;
BEGIN
  v_current_year := EXTRACT(YEAR FROM now())::INTEGER;

  -- Lock the row and get current values (or create default)
  INSERT INTO system.number_sequences (tenant_id, company_code, document_type, prefix, next_number, pad_length, reset_yearly, current_year)
  VALUES (p_tenant_id, p_company_code, p_document_type, UPPER(LEFT(p_document_type, 3)) || '-', 1, 6, false, v_current_year)
  ON CONFLICT (tenant_id, company_code, document_type) DO UPDATE
  SET updated_at = now()
  RETURNING prefix, next_number, pad_length, reset_yearly, current_year
  INTO v_prefix, v_next, v_pad, v_reset, v_year;

  -- Handle yearly reset
  IF v_reset AND (v_year IS NULL OR v_year < v_current_year) THEN
    UPDATE system.number_sequences
    SET next_number = 2, current_year = v_current_year
    WHERE tenant_id = p_tenant_id AND company_code = p_company_code AND document_type = p_document_type;
    RETURN v_prefix || LPAD('1', v_pad, '0');
  END IF;

  -- Increment for next call
  UPDATE system.number_sequences
  SET next_number = v_next + 1
  WHERE tenant_id = p_tenant_id AND company_code = p_company_code AND document_type = p_document_type;

  RETURN v_prefix || LPAD(v_next::TEXT, v_pad, '0');
END;
$$ LANGUAGE plpgsql;

CREATE INDEX idx_number_sequences_tenant ON system.number_sequences(tenant_id, company_code);
