import { Result } from 'better-result'
import { beforeEach, describe, expect, mock, test } from 'bun:test'

const createServerFnMock = (opts?: unknown): Record<string, unknown> => ({
  inputValidator() {
    return this
  },
  middleware() {
    return this
  },
  handler(fn: unknown) {
    return fn
  },
})

const useSessionData = mock(() => ({}))

const useSessionUpdate = mock(async (_data: unknown) => {})

const useSessionClear = mock(async () => {})

const useSessionMock = mock(
  async (
    _opts: unknown,
  ): Promise<{
    data: Record<string, unknown>
    update: typeof useSessionUpdate
    clear: typeof useSessionClear
  }> => ({
    data: useSessionData(),
    update: useSessionUpdate,
    clear: useSessionClear,
  }),
)

const redirectMock = mock((_opts: unknown) => {
  throw new Error('REDIRECT')
})

mock.module('@tanstack/react-start', () => ({
  createServerFn: createServerFnMock,
  createMiddleware: () => ({
    server: (handler: unknown) => handler,
  }),
}))

mock.module('@tanstack/react-start/server', () => ({
  useSession: useSessionMock,
  getRequestHeaders: mock(() => ({ cookie: 'session=test' })),
  setResponseStatus: mock(() => {}),
}))

mock.module('@tanstack/react-router', () => ({
  redirect: redirectMock,
}))

const { getSignUpSession, updateSignUpSession, clearSignUpSession, validateSignUpSession } =
  await import('../../src/session/onboarding-session')

describe('onboarding-session', () => {
  beforeEach(() => {
    useSessionMock.mockClear()
    useSessionData.mockClear()
    useSessionUpdate.mockClear()
    useSessionClear.mockClear()
    redirectMock.mockClear()

    useSessionData.mockImplementation(() => ({
      state: 'account',
      accountData: { firstName: 'John', email: 'john@test.com' },
    }))
    useSessionUpdate.mockImplementation(async (_data: unknown) => {})
    useSessionClear.mockImplementation(async () => {})
  })

  describe('getSignUpSession', () => {
    test('returns session data', async () => {
      useSessionData.mockImplementation(() => ({
        state: 'account',
        accountData: { firstName: 'John', email: 'john@test.com' },
      }))

      const result = await getSignUpSession()

      expect(useSessionMock).toHaveBeenCalledWith({
        name: 'signup-session',
        password: 'test-secret-that-is-at-least-32-chars-long!!',
        cookie: { httpOnly: true, sameSite: 'lax', secure: false },
      })
      expect(result).toMatchObject({
        state: 'account',
        accountData: { firstName: 'John' },
      })
    })

    test('returns empty data when no session exists', async () => {
      useSessionData.mockImplementation(() => ({}))

      const result = await getSignUpSession()

      expect(result).toEqual({})
    })
  })

  describe('updateSignUpSession', () => {
    test('updates session with provided data', async () => {
      const sessionData = {
        accountData: { firstName: 'John', email: 'john@test.com' },
        state: 'account' as const,
      }

      const result = await updateSignUpSession({ data: sessionData })

      expect(useSessionUpdate).toHaveBeenCalledWith(sessionData)
      expect(result.status).toBe('ok')
    })

    test('returns error when update fails', async () => {
      useSessionUpdate.mockImplementation(async (_data: unknown) => {
        throw new Error('Session update failed')
      })

      const result = await updateSignUpSession({
        data: {
          accountData: { firstName: 'John', email: 'john@test.com' },
          state: 'account' as const,
        },
      })

      expect(result.status).toBe('error')
    })
  })

  describe('clearSignUpSession', () => {
    test('clears session and returns success', async () => {
      const result = await clearSignUpSession()

      expect(useSessionClear).toHaveBeenCalled()
      expect(result).toEqual({ success: true })
    })
  })

  describe('validateSignUpSession', () => {
    test('returns session when requesting the current state', async () => {
      useSessionData.mockImplementation(() => ({
        state: 'account',
        accountData: { firstName: 'John', email: 'john@test.com' },
      }))

      const result = await validateSignUpSession({ data: 'account' })

      expect(result.state).toBe('account')
    })

    test('returns session when moving forward in flow', async () => {
      useSessionData.mockImplementation(() => ({
        state: 'account',
        accountData: { firstName: 'John', email: 'john@test.com' },
      }))

      const result = await validateSignUpSession({ data: 'user-data' })

      expect(result.state).toBe('account')
    })

    test('redirects when going back to a previous step', async () => {
      useSessionData.mockImplementation(() => ({
        state: 'user-data',
        accountData: { firstName: 'John' },
        userData: { phoneNumber: '+123' },
      }))

      await expect(validateSignUpSession({ data: 'account' })).rejects.toThrow('REDIRECT')
    })

    test('redirects when requesting user-data without account data', async () => {
      useSessionData.mockImplementation(() => ({
        state: 'account',
        accountData: undefined,
      }))

      await expect(validateSignUpSession({ data: 'user-data' })).rejects.toThrow('REDIRECT')
    })

    test('allows user-data step when account data is present', async () => {
      useSessionData.mockImplementation(() => ({
        state: 'account',
        accountData: { firstName: 'John', email: 'john@test.com' },
      }))

      const result = await validateSignUpSession({ data: 'user-data' })

      expect(result.state).toBe('account')
    })
  })
})
