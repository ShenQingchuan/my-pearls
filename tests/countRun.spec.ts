import { describe, expect, test } from 'vitest'
import { countRun, onceRun } from '../src/countRun'

describe('MyPearl: countCall', () => {
  test('onceCall', () => {
    const fn = onceRun(() => 1)
    expect(fn()).toBe(1)
    expect(fn()).toBe(undefined)
  })

  test('countCall', () => {
    const fn = countRun(() => 1, 2)
    expect(fn()).toBe(1)
    expect(fn()).toBe(1)
    expect(fn()).toBe(undefined)
  })
})
