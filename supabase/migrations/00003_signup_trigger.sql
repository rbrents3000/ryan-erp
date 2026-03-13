-- Trigger function: auto-create tenant + company + profile on user signup
CREATE OR REPLACE FUNCTION system.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_tenant_id UUID;
  company_name TEXT;
BEGIN
  -- Read company name from signup metadata
  company_name := NEW.raw_user_meta_data ->> 'company_name';
  IF company_name IS NULL OR company_name = '' THEN
    company_name := 'My Company';
  END IF;

  -- Create the tenant
  INSERT INTO system.tenants (name)
    VALUES (company_name)
    RETURNING id INTO new_tenant_id;

  -- Store tenant_id in app_metadata (secure, not user-editable)
  UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) ||
      jsonb_build_object('tenant_id', new_tenant_id::text)
    WHERE id = NEW.id;

  -- Create default company
  INSERT INTO system.companies (tenant_id, company_code, name, base_currency)
    VALUES (new_tenant_id, '01', company_name, 'USD');

  -- Create user profile
  INSERT INTO system.user_profiles (id, tenant_id, display_name, default_company_code)
    VALUES (
      NEW.id,
      new_tenant_id,
      COALESCE(
        NEW.raw_user_meta_data ->> 'full_name',
        split_part(NEW.email, '@', 1)
      ),
      '01'
    );

  -- Seed default currencies
  INSERT INTO system.currencies (tenant_id, code, name, symbol, decimal_places) VALUES
    (new_tenant_id, 'USD', 'US Dollar', '$', 2),
    (new_tenant_id, 'EUR', 'Euro', '€', 2),
    (new_tenant_id, 'GBP', 'British Pound', '£', 2);

  -- Seed default UOM
  INSERT INTO system.units_of_measure (tenant_id, code, name, uom_type) VALUES
    (new_tenant_id, 'EA', 'Each', 'unit'),
    (new_tenant_id, 'KG', 'Kilogram', 'weight'),
    (new_tenant_id, 'LB', 'Pound', 'weight'),
    (new_tenant_id, 'GAL', 'Gallon', 'volume'),
    (new_tenant_id, 'LT', 'Liter', 'volume'),
    (new_tenant_id, 'CS', 'Case', 'unit'),
    (new_tenant_id, 'PK', 'Pack', 'unit'),
    (new_tenant_id, 'HR', 'Hour', 'time');

  -- Seed default payment terms
  INSERT INTO system.terms (tenant_id, code, description, days_due, discount_pct, discount_days) VALUES
    (new_tenant_id, 'NET30', 'Net 30 Days', 30, 0, 0),
    (new_tenant_id, 'NET60', 'Net 60 Days', 60, 0, 0),
    (new_tenant_id, '2/10N30', '2% 10 Net 30', 30, 2.00, 10),
    (new_tenant_id, 'COD', 'Cash on Delivery', 0, 0, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION system.handle_new_user();
