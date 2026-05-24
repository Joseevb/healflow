import type { HealthScore } from '@/db/types/health-score.zod'

import { Card, CardContent } from '@/components/ui/card'

function getScoreTone(score: number) {
  if (score >= 80) {
    return {
      text: 'text-teal-600 dark:text-teal-400',
      ring: 'from-blue-500 via-teal-500 to-green-500',
    }
  }

  if (score >= 60) {
    return {
      text: 'text-blue-600 dark:text-blue-400',
      ring: 'from-blue-500 via-cyan-500 to-teal-500',
    }
  }

  return {
    text: 'text-cyan-600 dark:text-cyan-400',
    ring: 'from-cyan-500 to-blue-500',
  }
}

export function HealthScoreCard({ score }: { score: HealthScore }) {
  const tone = getScoreTone(score.overallScore)

  const subScores = [
    { label: 'Cardiovascular', value: score.cardiovascularScore },
    { label: 'Metabolic', value: score.metabolicScore },
    { label: 'Lifestyle', value: score.lifestyleScore },
    { label: 'Vital Signs', value: score.vitalScore },
  ]

  return (
    <Card className="border border-border/60 bg-card/95 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex justify-center lg:justify-start">
            <div
              className={`flex size-32 items-center justify-center rounded-full bg-linear-to-br ${tone.ring} shadow-lg`}
            >
              <div className="flex size-24 items-center justify-center rounded-full bg-white dark:bg-slate-950">
                <span className={`text-4xl font-bold ${tone.text}`}>{score.overallScore}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Overall Health Score
              </h2>
              <p className="text-sm text-muted-foreground">
                Based on {score.dataPointsCount} recorded data points over the last{' '}
                {score.periodDays} days.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {subScores.map((subScore) => (
                <div
                  key={subScore.label}
                  className="rounded-xl border border-border/50 bg-muted/25 p-4"
                >
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {subScore.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {subScore.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
