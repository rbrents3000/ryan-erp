import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { UserMenu } from "@/components/layout/user-menu"
import { CompanySelector } from "@/components/layout/company-selector"
import { getTenantContext } from "@/lib/auth/tenant"
import { db } from "@/lib/db"
import { companies } from "@/lib/db/schema"
import { eq, isNull, and } from "drizzle-orm"
import { createClient } from "@/lib/supabase/server"

export default async function ErpLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getTenantContext();

  const companyList = await db
    .select({ companyCode: companies.companyCode, name: companies.name })
    .from(companies)
    .where(and(eq(companies.tenantId, ctx.tenantId), isNull(companies.deletedAt)));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium">RyanERP</span>
          <div className="ml-4">
            <CompanySelector companies={companyList} defaultCode={ctx.defaultCompanyCode} />
          </div>
          <div className="ml-auto">
            <UserMenu email={user?.email ?? "user"} />
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
