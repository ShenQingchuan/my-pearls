import { describe, expect, test } from 'vitest'
import { getUniqueId } from '../src/uuid'

describe('MyPearl:UUID', () => {
  test('getUniqueId - Compact form', () => {
    const id = getUniqueId({ length: 8 })
    expect(id).toHaveLength(8)
  })
  test('getUniqueId - Standard form', () => {
    const id1 = getUniqueId()
    const id2 = getUniqueId()
    expect(id1).not.toBe(id2)
    // Didn't pass the length option, so the length of the id should be 36.
    // As the RFC 4122 - UUIDv4 defined.
    expect(id1.length).toBe(36)
    expect(id2.length).toBe(36)
  })
})
