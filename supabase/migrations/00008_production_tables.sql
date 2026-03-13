-- Recipes (Bill of Materials)
CREATE TABLE production.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  recipe_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  output_product_id UUID NOT NULL REFERENCES inventory.products(id),
  output_quantity NUMERIC(20,4) NOT NULL DEFAULT 1,
  output_uom TEXT NOT NULL DEFAULT 'EA',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, company_code, recipe_code)
);

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON production.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Recipe Lines (BOM components)
CREATE TABLE production.recipe_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES production.recipes(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  component_product_id UUID NOT NULL REFERENCES inventory.products(id),
  quantity NUMERIC(20,6) NOT NULL,
  uom_code TEXT NOT NULL DEFAULT 'EA',
  scrap_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_recipe_lines_updated_at
  BEFORE UPDATE ON production.recipe_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Production Jobs
CREATE TABLE production.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  company_code TEXT NOT NULL,
  job_number TEXT NOT NULL,
  recipe_id UUID NOT NULL REFERENCES production.recipes(id),
  planned_quantity NUMERIC(20,4) NOT NULL,
  actual_quantity NUMERIC(20,4) NOT NULL DEFAULT 0,
  planned_start DATE,
  planned_end DATE,
  actual_start DATE,
  actual_end DATE,
  warehouse_id UUID REFERENCES inventory.warehouses(id),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'released', 'in_progress', 'completed', 'closed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, company_code, job_number)
);

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON production.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Job Material Issues
CREATE TABLE production.job_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES production.jobs(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES inventory.products(id),
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
  planned_quantity NUMERIC(20,4) NOT NULL DEFAULT 0,
  issued_quantity NUMERIC(20,4) NOT NULL DEFAULT 0,
  returned_quantity NUMERIC(20,4) NOT NULL DEFAULT 0,
  uom_code TEXT NOT NULL DEFAULT 'EA',
  issue_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_job_materials_updated_at
  BEFORE UPDATE ON production.job_materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Job Labor (Time Cards)
CREATE TABLE production.job_labor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES system.tenants(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES production.jobs(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  work_date DATE NOT NULL,
  hours_worked NUMERIC(8,2) NOT NULL,
  labor_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  labor_cost NUMERIC(20,2) NOT NULL DEFAULT 0,
  operation TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_job_labor_updated_at
  BEFORE UPDATE ON production.job_labor
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
