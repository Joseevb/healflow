import type { LucideIcon } from 'lucide-react'

import { Clock } from 'lucide-react'

type ActivityItemProps = {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  description: string
  timestamp: string
}

export function ActivityItem({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  timestamp,
}: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 transition-colors hover:bg-accent/35">
      <div className={`rounded-xl p-2.5 ${iconBg} ring-1 ring-black/5 dark:ring-white/10`}>
        <Icon className={`size-4 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="size-3" />
        {timestamp}
      </div>
    </div>
  )
}
