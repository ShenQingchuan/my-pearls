/**
 * Creates a function that is restricted to invoking `fn` once. Repeat calls to
 * the function would return undefined.
 *
 * @param fn Given a function that expects to run only once.
 * @returns If the `fn` has already been called, returns undefined. Otherwise, returns the result of calling `fn`.
 *
 * @category Other
 */
export function onceRun<T extends (...args: any[]) => any>(fn: T): T {
  let called = false
  return function (...args: any[]) {
    if (!called) {
      called = true
      return fn(...args)
    }
  } as T
}

/**
 * Creates a function that is restricted to invoking `fn` for `count` times.
 * Extra calls to the function would return undefined.
 *
 * @param fn Given a function that expects to run only `count` times.
 * @param count The number of times the function can be called.
 * @returns If the `fn` has already been called `count` times, returns undefined. Otherwise, returns the result of calling `fn`.
 *
 * @category Other
 */
export function countRun<T extends (...args: any[]) => any>(
  fn: T,
  count: number
): T {
  let called = 0
  return function (...args: any[]) {
    if (called < count) {
      called++
      return fn(...args)
    }
  } as T
}
