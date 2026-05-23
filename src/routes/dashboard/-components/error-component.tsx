import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle, Heart, Lock, RefreshCw, ShieldAlert, WifiOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type ErrorComponentProps = {
  error: unknown
  reset: () => void
}

type ErrorKind = 'unauthorized' | 'forbidden' | 'connection' | 'generic'

type ErrorInfo = {
  name?: string
  message: string
  status?: number
}

type ErrorConfig = {
  title: string
  message: string
  icon: typeof AlertTriangle
  iconColor: string
  iconBg: string
  cardBg: string
  borderColor: string
  showSignInButton?: boolean
}

const ERROR_CONFIG: Record<ErrorKind, ErrorConfig> = {
  unauthorized: {
    title: 'Sign in required',
    message: 'Your session is no longer valid. Sign in again to continue using the dashboard.',
    icon: Lock,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    cardBg: 'bg-blue-50/60 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    showSignInButton: true,
  },
  forbidden: {
    title: 'Access restricted',
    message: 'Your account does not have permission to load this dashboard data.',
    icon: ShieldAlert,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-900/30',
    cardBg: 'bg-teal-50/60 dark:bg-teal-950/20',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  connection: {
    title: 'Connection interrupted',
    message:
      'The dashboard request was interrupted before all data finished loading. Try again in a moment.',
    icon: WifiOff,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
    cardBg: 'bg-sky-50/60 dark:bg-sky-950/20',
    borderColor: 'border-sky-200 dark:border-sky-800',
  },
  generic: {
    title: 'Unable to load dashboard',
    message:
      'Something went wrong while loading your health overview. Try again, and contact support if it keeps happening.',
    icon: AlertTriangle,
    iconColor: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    cardBg: 'bg-red-50/60 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
}

const CONNECTION_ERROR_PATTERNS = ['timed out', 'connection was closed', 'fetch failed']

function getStatus(value: unknown) {
  return typeof value === 'number' ? value : undefined
}

function getErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    const errorRecord = error as Error & {
      status?: number
      statusCode?: number
      cause?: { status?: number; statusCode?: number }
    }

    return {
      name: error.name,
      message: error.message,
      status:
        getStatus(errorRecord.status) ??
        getStatus(errorRecord.statusCode) ??
        getStatus(errorRecord.cause?.status) ??
        getStatus(errorRecord.cause?.statusCode),
    }
  }

  if (typeof error === 'string') {
    return { message: error }
  }

  if (error && typeof error === 'object') {
    const errorRecord = error as Record<string, unknown>
    const cause = errorRecord.cause as Record<string, unknown> | undefined

    return {
      name: typeof errorRecord.name === 'string' ? errorRecord.name : undefined,
      message: typeof errorRecord.message === 'string' ? errorRecord.message : 'Unknown error',
      status:
        getStatus(errorRecord.status) ??
        getStatus(errorRecord.statusCode) ??
        getStatus(cause?.status) ??
        getStatus(cause?.statusCode),
    }
  }

  return { message: 'Unknown error' }
}

function getErrorKind({ status, message, name }: ErrorInfo): ErrorKind {
  const normalizedMessage = message.toLowerCase()

  switch (status) {
    case 401:
      return 'unauthorized'
    case 403:
      return 'forbidden'
  }

  switch (normalizedMessage) {
    case 'unauthorized':
      return 'unauthorized'
    case 'forbidden':
      return 'forbidden'
  }

  switch (true) {
    case name === 'AbortError':
    case CONNECTION_ERROR_PATTERNS.some((pattern) => normalizedMessage.includes(pattern)):
      return 'connection'
    default:
      return 'generic'
  }
}

function getTechnicalDetails(error: unknown, info: ErrorInfo) {
  return JSON.stringify(
    {
      name: info.name,
      message: info.message,
      status: info.status,
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5).join('\n') : undefined,
    },
    null,
    2,
  )
}

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const navigate = useNavigate()
  const info = getErrorInfo(error)
  const config = ERROR_CONFIG[getErrorKind(info)]
  const ErrorIcon = config.icon

  console.count(`DASHBOARD_ERROR_${info.status || info.name || 'UNKNOWN'}`)

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2 dark:bg-blue-900/20">
              <Heart className="size-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <p className="max-w-md text-muted-foreground">Your health overview and quick actions</p>
        </div>
      </header>

      <Card className={`mx-auto w-full max-w-3xl ${config.borderColor} ${config.cardBg}`}>
        <CardContent className="flex flex-col items-center gap-6 px-8 py-10 text-center">
          <div className={`flex size-16 items-center justify-center rounded-2xl ${config.iconBg}`}>
            <ErrorIcon className={`size-8 ${config.iconColor}`} />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">{config.title}</h2>
            <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground">
              {config.message}
            </p>
          </div>

          {info.status && (
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Error code: {info.status}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="mr-2 size-4" />
              Try Again
            </Button>

            {config.showSignInButton && (
              <Button onClick={() => navigate({ to: '/auth' })}>Sign In</Button>
            )}
          </div>

          {import.meta.env.DEV && (
            <details className="w-full max-w-2xl rounded-xl border border-border/60 bg-background/70 p-4 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:underline">
                Technical Details
              </summary>
              <pre className="mt-3 max-h-56 overflow-auto text-xs">
                {getTechnicalDetails(error, info)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
