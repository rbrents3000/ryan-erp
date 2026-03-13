import Link from "next/link"
import { modules } from "@/lib/config/modules"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to RyanERP
        </h1>
        <p className="text-muted-foreground">
          Your modern enterprise resource planning system.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((mod) => {
          const Icon = mod.icon
          const subCount = mod.subItems?.length ?? 0
          return (
            <Link key={mod.code} href={mod.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{mod.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {mod.code}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {subCount > 0
                      ? `${subCount} sub-module${subCount !== 1 ? "s" : ""}`
                      : "Overview"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
