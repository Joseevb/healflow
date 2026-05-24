import { Result } from 'better-result'
import { describe, expect, test } from 'bun:test'

import { safeSerialize } from '../../src/lib/result'

describe('safeSerialize', () => {
  test('with ok result returns status ok and preserves value', () => {
    const result = Result.ok({ id: 1, name: 'test' })

    const serialized = safeSerialize(result)

    expect(serialized).toEqual({
      status: 'ok',
      value: { id: 1, name: 'test' },
    })
  })

  test('with error result returns status error with string cause', () => {
    const result = Result.err({ message: 'something went wrong', cause: new Error('root cause') })

    const serialized = safeSerialize(result)

    expect(serialized.status).toBe('error')
    if (serialized.status === 'error') {
      expect(serialized.error.message).toBe('something went wrong')
    }
  })
})
