import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatCardProps = {
  icon: LucideIcon
  iconBg: string
  iconColor?: string
  label: string
  value: string | number
  valueColor?: string
  sublabel?: string
  trend?: {
    icon: LucideIcon
    value: string
    color: string
  }
}

export function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  valueColor,
  sublabel,
  trend,
}: StatCardProps) {
  return (
    <Card className="group border border-border/60 bg-card/95 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`rounded-2xl p-3 ${iconBg} ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 dark:ring-white/10`}
          >
            <Icon className={`size-6 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className={cn('text-2xl font-bold', valueColor)}>{value}</p>
            {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
            {trend && (
              <p className={`mt-1 flex items-center gap-1 text-xs ${trend.color}`}>
                <trend.icon className="size-3" /> {trend.value}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
