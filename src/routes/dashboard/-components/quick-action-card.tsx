import type { LucideIcon } from 'lucide-react'

import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { RoutePath } from '@/types/routes'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type QuickActionCardProps = {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  description: string
  linkTo?: RoutePath
  onClick?: () => void
  colorScheme: 'blue' | 'teal' | 'green'
  buttonLabel: string
}

export function QuickActionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  linkTo,
  onClick,
  colorScheme,
  buttonLabel,
}: QuickActionCardProps) {
  const hoverClasses = {
    blue: 'group-hover:border-blue-200 group-hover:bg-blue-50/70 dark:group-hover:border-blue-800 dark:group-hover:bg-blue-900/20',
    teal: 'group-hover:border-teal-200 group-hover:bg-teal-50/70 dark:group-hover:border-teal-800 dark:group-hover:bg-teal-900/20',
    green:
      'group-hover:border-green-200 group-hover:bg-green-50/70 dark:group-hover:border-green-800 dark:group-hover:bg-green-900/20',
  }

  const shadowClasses = {
    blue: 'dark:hover:shadow-blue-500/10',
    teal: 'dark:hover:shadow-teal-500/10',
    green: 'dark:hover:shadow-green-500/10',
  }

  const content = (
    <>
      <CardHeader>
        <div
          className={`mb-2 w-fit rounded-2xl p-3 ${iconBg} ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 dark:ring-white/10`}
        >
          <Icon className={`size-6 ${iconColor}`} />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {linkTo ? (
          <Button
            variant="outline"
            className={`w-full transition-colors ${hoverClasses[colorScheme]}`}
            nativeButton={false}
            render={
              <Link to={linkTo} className="flex items-center justify-center gap-2">
                {buttonLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
        ) : (
          <Button
            variant="outline"
            className={`w-full transition-colors ${hoverClasses[colorScheme]}`}
            onClick={onClick}
          >
            <span className="flex items-center justify-center gap-2">
              {buttonLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        )}
      </CardContent>
    </>
  )

  return (
    <Card
      className={`group border border-border/60 bg-card/95 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${shadowClasses[colorScheme]}`}
    >
      {content}
    </Card>
  )
}
