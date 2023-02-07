import { describe, expect, test } from 'vitest'
import { splitIntoChunks } from '../src'

describe('MyPearl: splitIntoChunks', () => {
  const createMockArr = () => Array.from({ length: 25 }, (_, i) => i + 1)
  const sharedChunksTest = (chunks: number[][]) => {
    expect(chunks.length).toBe(9)
    expect(chunks.at(-1)?.length).toBe(1)
    expect(chunks.at(-1)).toEqual([25])
  }

  test('splitIntoChunks - Array', () => {
    const mockArr = createMockArr()
    const chunks = splitIntoChunks(mockArr, 3)
    sharedChunksTest(chunks)
  })

  test('splitIntoChunks - Set', () => {
    const mockArr = new Set(createMockArr())
    const chunks = splitIntoChunks(mockArr, 3)
    sharedChunksTest(chunks)
  })
})
