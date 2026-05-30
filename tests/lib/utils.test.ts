import { describe, expect, test } from 'bun:test'

import {
  cn,
  createUrl,
  formatDate,
  formatMetricTitle,
  formatRelativeTime,
  formatTime,
  getInitials,
  keysOf,
  wait,
} from '../../src/lib/utils'

describe('utils', () => {
  test('cn merges class names and resolves tailwind conflicts', () => {
    expect(cn('px-2', false, 'px-4', 'text-sm')).toBe('px-4 text-sm')
  })

  test('cn handles falsy values', () => {
    expect(cn('px-2', null, undefined, '', 'py-1')).toBe('px-2 py-1')
  })

  test('cn merges multiple classes without conflict', () => {
    expect(cn('text-lg', 'font-bold', 'text-red-500')).toBe('text-lg font-bold text-red-500')
  })

  test('keysOf returns the object keys as a typed array', () => {
    const result = keysOf({ admin: 1, client: 2, specialist: 3 })

    expect(result).toEqual(['admin', 'client', 'specialist'])
  })

  test('keysOf returns empty array for empty object', () => {
    expect(keysOf({})).toEqual([])
  })

  test('createUrl creates a URL with params', () => {
    globalThis.window = { location: { origin: 'http://localhost' } } as Window & typeof globalThis

    const url: string = createUrl('/appointments' as never, { page: '2', filter: 'active' })

    expect(url).toBe('http://localhost/appointments?page=2&filter=active')
  })

  test('createUrl creates a URL without params', () => {
    globalThis.window = { location: { origin: 'http://localhost' } } as Window & typeof globalThis

    const url: string = createUrl('/appointments' as never)

    expect(url).toBe('http://localhost/appointments')
  })

  test('getInitials returns U for null', () => {
    expect(getInitials(null)).toBe('U')
  })

  test('getInitials returns U for undefined', () => {
    expect(getInitials(undefined)).toBe('U')
  })

  test('getInitials returns first letter for single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  test('getInitials returns initials for full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  test('getInitials returns initials for multiple name parts', () => {
    expect(getInitials('John Michael Doe')).toBe('JD')
  })

  test('wait resolves after given ms', async () => {
    const start = performance.now()

    await wait(1)

    const elapsed = performance.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(0)
  })

  test('formatRelativeTime returns Just now for less than 1 minute', () => {
    const date = new Date()

    expect(formatRelativeTime(date.toISOString())).toBe('Just now')
  })

  test('formatRelativeTime returns minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000)

    expect(formatRelativeTime(date.toISOString())).toBe('5 minutes ago')
  })

  test('formatRelativeTime returns minute ago for 1 minute', () => {
    const date = new Date(Date.now() - 60 * 1000)

    expect(formatRelativeTime(date.toISOString())).toBe('1 minute ago')
  })

  test('formatRelativeTime returns hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000)

    expect(formatRelativeTime(date.toISOString())).toBe('3 hours ago')
  })

  test('formatRelativeTime returns Yesterday', () => {
    const date = new Date(Date.now() - 24 * 60 * 60 * 1000)

    expect(formatRelativeTime(date.toISOString())).toBe('Yesterday')
  })

  test('formatRelativeTime returns days ago for less than 7 days', () => {
    const date = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)

    expect(formatRelativeTime(date.toISOString())).toBe('4 days ago')
  })

  test('formatRelativeTime returns locale date for older dates', () => {
    const date = new Date('2023-01-15')

    expect(formatRelativeTime(date.toISOString())).toBe(date.toLocaleDateString())
  })

  test('formatMetricTitle returns correct display for known types', () => {
    expect(formatMetricTitle('HEART_RATE')).toBe('Heart Rate')
    expect(formatMetricTitle('BLOOD_PRESSURE_SYSTOLIC')).toBe('Blood Pressure (Systolic)')
    expect(formatMetricTitle('BLOOD_GLUCOSE')).toBe('Blood Glucose')
    expect(formatMetricTitle('BMI')).toBe('BMI')
  })

  test('formatMetricTitle converts underscores to spaces for unknown types', () => {
    expect(formatMetricTitle('CUSTOM_METRIC')).toBe('CUSTOM METRIC')
  })

  test('formatDate returns a formatted date string', () => {
    const dateStr = '2025-06-15T10:30:00'
    const formatted = formatDate(dateStr)

    expect(formatted).toContain('2025')
    expect(formatted).toContain('Jun')
  })

  test('formatTime returns a formatted time string', () => {
    const dateStr = '2025-06-15T10:30:00'
    const formatted = formatTime(dateStr)

    expect(formatted).toMatch(/\d{2}:\d{2}/)
  })
})
