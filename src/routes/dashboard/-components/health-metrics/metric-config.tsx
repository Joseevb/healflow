import type { LucideIcon } from 'lucide-react'

import {
  Activity,
  Droplets,
  Footprints,
  Heart,
  Moon,
  Scale,
  Thermometer,
  Timer,
  TrendingUp,
  Wind,
} from 'lucide-react'

import { formatMetricTitle } from '@/lib/utils'

export type MetricConfig = {
  label: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
}

const METRIC_CONFIG: Record<string, MetricConfig> = {
  BLOOD_PRESSURE_SYSTOLIC: {
    label: formatMetricTitle('BLOOD_PRESSURE_SYSTOLIC'),
    icon: Heart,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  BLOOD_PRESSURE_DIASTOLIC: {
    label: formatMetricTitle('BLOOD_PRESSURE_DIASTOLIC'),
    icon: Heart,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/20',
  },
  HEART_RATE: {
    label: formatMetricTitle('HEART_RATE'),
    icon: Activity,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-900/20',
  },
  OXYGEN_SATURATION: {
    label: formatMetricTitle('OXYGEN_SATURATION'),
    icon: Wind,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-100 dark:bg-sky-900/20',
  },
  WEIGHT: {
    label: formatMetricTitle('WEIGHT'),
    icon: Scale,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
  },
  HEIGHT: {
    label: formatMetricTitle('HEIGHT'),
    icon: TrendingUp,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/20',
  },
  BMI: {
    label: formatMetricTitle('BMI'),
    icon: Scale,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-900/20',
  },
  BLOOD_GLUCOSE: {
    label: formatMetricTitle('BLOOD_GLUCOSE'),
    icon: Droplets,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  HBA1C: {
    label: formatMetricTitle('HBA1C'),
    icon: Droplets,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-900/20',
  },
  CHOLESTEROL_TOTAL: {
    label: formatMetricTitle('CHOLESTEROL_TOTAL'),
    icon: Heart,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  CHOLESTEROL_LDL: {
    label: formatMetricTitle('CHOLESTEROL_LDL'),
    icon: Heart,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/20',
  },
  CHOLESTEROL_HDL: {
    label: formatMetricTitle('CHOLESTEROL_HDL'),
    icon: Heart,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
  },
  TRIGLYCERIDES: {
    label: formatMetricTitle('TRIGLYCERIDES'),
    icon: Droplets,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-900/20',
  },
  BODY_TEMPERATURE: {
    label: formatMetricTitle('BODY_TEMPERATURE'),
    icon: Thermometer,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
  },
  RESPIRATORY_RATE: {
    label: formatMetricTitle('RESPIRATORY_RATE'),
    icon: Wind,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/20',
  },
  SLEEP_HOURS: {
    label: formatMetricTitle('SLEEP_HOURS'),
    icon: Moon,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/20',
  },
  EXERCISE_MINUTES: {
    label: formatMetricTitle('EXERCISE_MINUTES'),
    icon: Timer,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
  },
  WATER_INTAKE: {
    label: formatMetricTitle('WATER_INTAKE'),
    icon: Droplets,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  STEPS: {
    label: formatMetricTitle('STEPS'),
    icon: Footprints,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/20',
  },
}

const DEFAULT_CONFIG: MetricConfig = {
  label: 'Unknown Metric',
  icon: Activity,
  iconColor: 'text-slate-600 dark:text-slate-400',
  iconBg: 'bg-slate-100 dark:bg-slate-900/80',
}

export function getMetricConfig(metricType: string): MetricConfig {
  return METRIC_CONFIG[metricType] ?? DEFAULT_CONFIG
}
