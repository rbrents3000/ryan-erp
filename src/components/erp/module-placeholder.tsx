import { Hammer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ModulePlaceholderProps {
  title: string
  description: string
  moduleCode: string
}

export function ModulePlaceholder({
  title,
  description,
  moduleCode,
}: ModulePlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <Hammer className="size-6 text-muted-foreground" />
          </div>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{moduleCode}</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">{description}</p>
          <Badge variant="secondary">Coming Soon</Badge>
        </CardContent>
      </Card>
    </div>
  )
}
