/**
 * Filters out all the empty strings from the given array.
 *
 * @param strings String array may contains empty string.
 * @returns String array without empty string.
 * @category Strings
 */
export function filterEmptyStr(strings: string[]): string[] {
  return strings.filter((str) => str !== '')
}
