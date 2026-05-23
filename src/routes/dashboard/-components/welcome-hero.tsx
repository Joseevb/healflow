import { Link } from '@tanstack/react-router'
import { Calendar, Heart } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { HeroShell } from './hero-shell'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! 👋'
  if (hour < 18) return 'Good afternoon! 👋'
  return 'Good evening! 👋'
}

export function WelcomeHero() {
  return (
    <HeroShell>
      <div>
        <Badge
          variant="secondary"
          className="mb-4 border-border/60 bg-white/80 text-foreground shadow-sm backdrop-blur-xs dark:border-white/15 dark:bg-white/10 dark:text-primary-foreground dark:hover:bg-white/15"
        >
          <Heart className="mr-1 size-3" />
          Welcome back
        </Badge>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{getGreeting()}</h1>
        <p className="max-w-xl text-lg text-foreground/80 dark:text-primary-foreground/82">
          Your health dashboard is ready. Track your appointments, medications, and health metrics
          all in one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            render={
              <Link to="/dashboard/appointments" className="flex items-center gap-2">
                <Calendar className="size-4" />
                Book Appointment
              </Link>
            }
            variant="secondary"
            className="border-0 bg-white/95 text-foreground shadow-sm hover:bg-white dark:bg-white/92 dark:text-slate-900 dark:hover:bg-white"
          />
          <Button
            variant="outline"
            className="border-border/60 bg-white/50 text-foreground hover:bg-white/75 dark:border-white/15 dark:bg-white/8 dark:text-primary-foreground dark:hover:bg-white/14 dark:hover:text-primary-foreground"
          >
            View Health Records
          </Button>
        </div>
      </div>
    </HeroShell>
  )
}
