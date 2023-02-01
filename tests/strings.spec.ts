import { describe, expect, test } from 'vitest'
import { colorful } from '../src/strings/colorful'
import { escapeForCreateRegExp, filterEmptyStr } from '../src/strings/dispose'

describe('MyPearl:strings', () => {
  test('filterEmptyStr', () => {
    expect(filterEmptyStr(['', 'a', 'b'])).toEqual(['a', 'b'])
  })

  test('escapeForCreateRegExp', () => {
    const str1 = '/path/to/resource.html?search=query'
    const str2 = '{ [bracket] in curly \\* }'
    const escapedStr1 = escapeForCreateRegExp(str1)
    const escapedStr2 = escapeForCreateRegExp(str2)
    expect(escapeForCreateRegExp(str1)).toBe(
      '\\/path\\/to\\/resource\\.html\\?search=query'
    )
    expect(escapeForCreateRegExp(str2)).toBe(
      '\\{ \\[bracket\\] in curly \\\\\\* \\}'
    )
    expect(new RegExp(escapedStr1).test(str1)).toBe(true)
    expect(new RegExp(escapedStr2).test(str2)).toBe(true)
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
