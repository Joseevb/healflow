import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { RoutePath } from '@/types/routes'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function keysOf<T extends Record<string, unknown>>(value: T): Array<keyof T> {
  return Object.keys(value) as Array<keyof T>
}

type TypedUrl = `${string}${RoutePath}`

export function createUrl(path: RoutePath, params?: Record<string, string>): TypedUrl {
  const url = new URL(path!, window.location.origin)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  return url.toString() as TypedUrl
}
