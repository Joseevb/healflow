import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type HeroShellProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function HeroShell({ children, className, contentClassName }: HeroShellProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border/60 bg-[linear-gradient(to_bottom_right,color-mix(in_oklab,hsl(var(--card))_74%,hsl(222_78%_58%)_26%)_0%,color-mix(in_oklab,hsl(var(--card))_58%,hsl(205_90%_56%)_42%)_28%,color-mix(in_oklab,hsl(var(--card))_48%,hsl(var(--primary))_52%)_62%,color-mix(in_oklab,hsl(var(--card))_38%,hsl(151_74%_42%)_62%)_100%)] text-card-foreground shadow-xs dark:bg-[linear-gradient(to_bottom_right,color-mix(in_oklab,hsl(var(--card))_14%,hsl(226_82%_58%)_86%)_0%,color-mix(in_oklab,hsl(var(--card))_10%,hsl(205_90%_56%)_90%)_28%,color-mix(in_oklab,hsl(var(--card))_8%,hsl(var(--primary))_92%)_62%,color-mix(in_oklab,hsl(var(--card))_8%,hsl(151_74%_42%)_92%)_100%)] dark:text-primary-foreground',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--background)/0.76),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,hsl(var(--background)/0.08),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom_right,hsl(222_78%_58%/0.04)_0%,hsl(205_90%_56%/0.05)_30%,hsl(188_92%_58%/0.07)_65%,hsl(149_76%_42%/0.1)_100%)] dark:bg-[linear-gradient(to_bottom_right,hsl(222_78%_58%/0.05)_0%,hsl(205_90%_56%/0.07)_30%,hsl(188_92%_58%/0.1)_65%,hsl(149_76%_42%/0.12)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.06)_1px,transparent_1px)] bg-size-[32px_32px] bg-center opacity-30 dark:opacity-20" />

      <div className={cn('relative z-10 p-8 sm:p-10', contentClassName)}>{children}</div>
    </section>
  )
}
