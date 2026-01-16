import deepFreeze from 'deep-freeze'
import { describe, test, expect } from 'vitest'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('returns initial state when state is undefined', () => {
    const action = { type: 'DO_NOTHING' }
    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = { type: 'GOOD' }
    deepFreeze(initialState)

    const newState = counterReducer(initialState, action)
    expect(newState).toEqual({ good: 1, ok: 0, bad: 0 })
  })

  test('reset works', () => {
    const state = { good: 3, ok: 2, bad: 1 }
    deepFreeze(state)

    const newState = counterReducer(state, { type: 'RESET' })
    expect(newState).toEqual(initialState)
  })
})
