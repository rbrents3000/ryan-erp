import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface TenantContext {
  userId: string;
  tenantId: string;
  defaultCompanyCode: string;
}

export const getTenantContext = cache(async (): Promise<TenantContext> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, user.id))
    .limit(1);

  if (!profile) {
    redirect("/login");
  }

  return {
    userId: user.id,
    tenantId: profile.tenantId,
    defaultCompanyCode: profile.defaultCompanyCode,
  };
});
