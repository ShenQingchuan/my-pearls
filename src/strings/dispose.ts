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

/**
 * Escape special character in string for building RegExp
 *
 * ## Example
 * ```js
 * escapeForCreateRegExp(
 *  "/path/to/resource.html?search=query"
 * ); // Expected: "\/path\/to\/resource\.html\?search=query"
 * ```
 *
 * @category Strings
 */
export function escapeForCreateRegExp(str: string) {
  return str.replace(/[$()*+./?[\\\]^{|}-]/g, '\\$&')
}
