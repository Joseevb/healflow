export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export type DayName = (typeof DAYS)[number]

export const dayName: DayName = DAYS[new Date().getDay()]
