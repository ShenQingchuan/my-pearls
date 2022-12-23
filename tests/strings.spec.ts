import { describe, expect, test } from 'vitest'
import { colorful } from '../src/strings/colorful'
import { filterEmptyStr } from '../src/strings/dispose'

describe('MyPearl:strings', () => {
  test('filterEmptyStr', () => {
    expect(filterEmptyStr(['', 'a', 'b'])).toEqual(['a', 'b'])
  })

  test('colorful', () => {
    const testStr1 = colorful('hello', ['blue'])
    const testStr2 = colorful('hello', ['red', 'bold', 'underline'])
    const testStr3 = colorful('hello', ['white', 'strikethrough', 'bgCyan'])
    expect(testStr1).toBe('\u001B[34mhello\u001B[0m')
    expect(testStr2).toBe('\u001B[31;1;4mhello\u001B[0m')
    expect(testStr3).toBe('\u001B[37;9;46mhello\u001B[0m')
  })
})
