import { client } from '@/client/client.gen'
import { authClient } from '@/lib/auth-client'
import { configureApiKeyInterceptor } from '@/lib/api-client'

// Configure API key interceptor for server-side requests
configureApiKeyInterceptor()

let tokenPromise: Promise<string | undefined> | null = null

const getCachedToken = async (): Promise<string | undefined> => {
  if (!tokenPromise) {
    tokenPromise = (async () => {
      try {
        // First check if there's an active session
        const session = await authClient.getSession()
        console.log(
          'Session check:',
          session.data ? 'Session exists' : 'No session',
        )

        if (!session.data?.session) {
          console.warn('No active session found - user not authenticated')
          return undefined
        }

        // Try to get the JWT token
        const tokenResponse = await authClient.token()
        console.log(
          'Auth token retrieved:',
          tokenResponse.data?.token ? 'Token exists' : 'No token',
        )

        if (!tokenResponse.data?.token) {
          console.error('Token response:', tokenResponse)
        }

        return tokenResponse.data?.token
      } catch (error) {
        console.error('Error getting auth token:', error)
        return undefined
      }
    })()
  }

  return tokenPromise
}

client.interceptors.request.use(async (request) => {
  try {
    const token = await getCachedToken()

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
      console.log('✓ Authorization header set for:', request.url)
    } else {
      console.warn('⚠ No auth token available for:', request.url)
    }
  } catch (error) {
    console.error('❌ Error setting auth header:', error)
  }

  return request
})

client.interceptors.response.use(async (response, request) => {
  if (!response.ok) {
    // Single, accurate error log with actual status code
    console.error(`❌ HTTP ${response.status} error for:`, request.url)

    // Track error for analytics
    console.count(`API_ERROR_${response.status}`)

    // Special handling for 401 - authentication issues
    if (response.status === 401) {
      console.error('→ User authentication required - clearing token cache')
      console.count('AUTH_TOKEN_EXPIRED')
      tokenPromise = null
    }

    // Track 404 errors separately for missing data
    if (response.status === 404) {
      console.count(`NOT_FOUND_${new URL(request.url).pathname}`)
    }

    // Log response body for detailed debugging
    try {
      const text = await response.clone().text()
      if (text) {
        console.error('Response body:', text)
      }
    } catch (e) {
      console.error('Could not read response body')
    }
  }

  return response
})

client.interceptors.error.use((error) => {
  console.error('❌ Client error:', error)

  // Track client errors for analytics
  console.count('CLIENT_ERROR')

  // Clear token cache on errors to allow retry
  tokenPromise = null
  return error
})
