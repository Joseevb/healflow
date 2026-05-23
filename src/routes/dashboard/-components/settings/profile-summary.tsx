import { CalendarDays, Mail, Shield, UserRound } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export function ProfileSummary({
  name,
  email,
  role,
  createdAt,
}: {
  name: string
  email: string
  role: string | null
  createdAt: Date
}) {
  return (
    <Card className="border border-border/60 bg-card/95 shadow-md">
      <CardContent className="grid gap-4 p-6 md:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/20">
            <UserRound className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Account Name</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-100 p-3 dark:bg-teal-900/20">
            <Mail className="size-5 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900/20">
            <Shield className="size-5 text-green-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Profile Status</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" size="sm">
                {role || 'client'}
              </Badge>
              <Badge variant="success" size="sm">
                Active
              </Badge>
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Joined {createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
